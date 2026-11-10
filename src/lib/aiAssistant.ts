import { Product, AIMessage, AIRecommendationContext } from "@/types";
import { PRODUCTS } from "@/constants/products";

// ============================
// AI Recommendation Engine
// (Mocked - Smart rule-based logic)
// ============================

interface ParsedQuery {
  roomSize?: number;      // sq ft
  climate?: string;
  budget?: number;
  tonnage?: number;
  energyRating?: number;
  brand?: string;
  intent?: string;
}

/**
 * Parse natural language query to extract recommendation parameters
 */
function parseQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase();
  const parsed: ParsedQuery = {};

  // Extract room size (sq ft)
  const sqftMatch = lower.match(/(\d+)\s*(?:sq\.?\s*ft|square\s*feet|sqft)/);
  if (sqftMatch) {
    parsed.roomSize = parseInt(sqftMatch[1]);
  }

  // Extract budget
  const budgetPatterns = [
    /budget\s*(?:of|is|around|under|below)?\s*(?:rs\.?|₹|inr)?\s*(\d+[\d,]*)/i,
    /(?:rs\.?|₹|inr)\s*(\d+[\d,]*)\s*budget/i,
    /under\s*(?:rs\.?|₹|inr)?\s*(\d+[\d,]*)/i,
    /below\s*(?:rs\.?|₹|inr)?\s*(\d+[\d,]*)/i,
    /(\d+)k?\s*budget/i,
  ];
  for (const pattern of budgetPatterns) {
    const match = lower.match(pattern);
    if (match) {
      let budget = parseInt(match[1].replace(/,/g, ""));
      if (match[0].includes("k")) budget *= 1000;
      parsed.budget = budget;
      break;
    }
  }

  // Detect climate/location hints
  if (
    lower.includes("chennai") || lower.includes("mumbai") || lower.includes("kolkata") ||
    lower.includes("humid") || lower.includes("coastal") || lower.includes("goa")
  ) {
    parsed.climate = "hot_humid";
  } else if (
    lower.includes("delhi") || lower.includes("jaipur") || lower.includes("lucknow") ||
    lower.includes("dry") || lower.includes("arid")
  ) {
    parsed.climate = "hot_dry";
  } else if (
    lower.includes("bangalore") || lower.includes("pune") || lower.includes("mild") || lower.includes("cool")
  ) {
    parsed.climate = "mild";
  }

  // Extract energy preferences
  if (lower.includes("5 star") || lower.includes("5-star") || lower.includes("five star") ||
      lower.includes("energy efficient") || lower.includes("low electricity") || lower.includes("save power")) {
    parsed.energyRating = 5;
  } else if (lower.includes("3 star") || lower.includes("3-star") || lower.includes("three star")) {
    parsed.energyRating = 3;
  }

  // Extract brand preferences
  const brands = ["daikin", "lg", "samsung", "voltas", "carrier", "hitachi", "blue star", "panasonic"];
  for (const brand of brands) {
    if (lower.includes(brand)) {
      parsed.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
      if (brand === "blue star") parsed.brand = "Blue Star";
      break;
    }
  }

  // Determine tonnage from room size
  if (parsed.roomSize) {
    if (parsed.roomSize <= 120) parsed.tonnage = 1;
    else if (parsed.roomSize <= 180) parsed.tonnage = 1.5;
    else if (parsed.roomSize <= 240) parsed.tonnage = 2;
    else parsed.tonnage = 2.5;
  }

  // Climate adjustments (humid climate needs higher tonnage)
  if (parsed.climate === "hot_humid" && parsed.tonnage) {
    if (parsed.tonnage < 2) parsed.tonnage += 0.5;
  }

  // Detect intent
  if (lower.includes("best") || lower.includes("recommend") || lower.includes("suggest")) {
    parsed.intent = "recommend";
  } else if (lower.includes("cheap") || lower.includes("affordable") || lower.includes("budget")) {
    parsed.intent = "budget";
  } else if (lower.includes("premium") || lower.includes("top") || lower.includes("luxury")) {
    parsed.intent = "premium";
  }

  return parsed;
}

/**
 * Score products based on parsed query
 */
function scoreProducts(products: Product[], parsed: ParsedQuery): Product[] {
  const scored = products.map((product) => {
    let score = 0;

    // Tonnage match (highest weight)
    if (parsed.tonnage) {
      const diff = Math.abs(product.tonnage - parsed.tonnage);
      if (diff === 0) score += 50;
      else if (diff <= 0.5) score += 25;
      else score -= 20;
    }

    // Budget filter
    if (parsed.budget) {
      if (product.price <= parsed.budget) {
        score += 30;
        // Reward value for money
        if (product.price >= parsed.budget * 0.7) score += 10;
      } else {
        score -= 50; // Over budget penalty
      }
    }

    // Energy rating preference
    if (parsed.energyRating) {
      if (product.energyRating === parsed.energyRating) score += 20;
      else if (product.energyRating > parsed.energyRating) score += 10; // Better than requested is ok
    } else if (parsed.climate === "hot_humid") {
      // Hot humid climates benefit from higher energy ratings
      score += product.energyRating * 3;
    }

    // Brand preference
    if (parsed.brand && product.brand.toLowerCase() === parsed.brand.toLowerCase()) {
      score += 15;
    }

    // Base quality score
    score += product.rating * 3;
    score += Math.log(product.reviewCount) * 2;

    // In-stock bonus
    if (product.inStock) score += 5;

    // Climate adjustments for 5-star in hot climates
    if (parsed.climate === "hot_humid" && product.energyRating >= 4) {
      score += 15;
    }

    // Intent adjustments
    if (parsed.intent === "budget") {
      const affordabilityScore = (100000 - product.price) / 2000;
      score += affordabilityScore;
    } else if (parsed.intent === "premium") {
      score += product.price / 5000;
    }

    return { product, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((s) => s.score > 0)
    .slice(0, 3)
    .map((s) => s.product);
}

/**
 * Generate human-readable AI response
 */
function generateResponse(query: string, parsed: ParsedQuery, recommendations: Product[]): string {
  const parts: string[] = [];

  if (recommendations.length === 0) {
    return "I couldn't find any ACs matching your exact requirements. Could you try adjusting your budget or being more flexible with the tonnage?";
  }

  // Intro based on what was detected
  if (parsed.roomSize && parsed.climate) {
    const climateDesc = parsed.climate === "hot_humid"
      ? "hot and humid"
      : parsed.climate === "hot_dry"
      ? "hot and dry"
      : "mild";
    parts.push(
      `For a **${parsed.roomSize} sq ft room** in a **${climateDesc} climate**, I recommend a **${parsed.tonnage} Ton AC** for optimal cooling.`
    );
  } else if (parsed.roomSize) {
    parts.push(
      `For a **${parsed.roomSize} sq ft room**, a **${parsed.tonnage} Ton AC** would be ideal.`
    );
  } else if (parsed.tonnage) {
    parts.push(`Here are the best **${parsed.tonnage} Ton ACs** for you:`);
  }

  // Climate note
  if (parsed.climate === "hot_humid") {
    parts.push(
      "In humid climates, I've prioritized **5-star inverter ACs** that also handle dehumidification effectively."
    );
  } else if (parsed.climate === "hot_dry") {
    parts.push(
      "For hot and dry conditions, I've focused on **high-cooling capacity** models with turbo cool features."
    );
  }

  // Budget note
  if (parsed.budget) {
    parts.push(`Filtering for options **under ₹${parsed.budget.toLocaleString("en-IN")}**.`);
  }

  // Energy rating note
  if (parsed.energyRating === 5) {
    parts.push(
      "For **5-star energy efficiency**, your electricity bills could be up to 30% lower compared to 3-star models."
    );
  }

  // Top recommendation highlight
  if (recommendations.length > 0) {
    const top = recommendations[0];
    parts.push(
      `\n**My top pick is the ${top.name}** — ₹${top.price.toLocaleString("en-IN")}, rated ${top.rating}⭐ by ${top.reviewCount.toLocaleString()} users.`
    );
  }

  if (recommendations.length > 1) {
    parts.push("Here are my recommendations:");
  }

  return parts.join(" ");
}

// ============================
// Main AI Chat Function
// ============================

export function generateAIResponse(
  userMessage: string,
  conversationHistory: AIMessage[]
): { response: string; products: Product[] } {
  const parsed = parseQuery(userMessage);
  const lower = userMessage.toLowerCase();

  // Handle greetings
  if (
    lower.match(/^(hi|hello|hey|namaste|good morning|good evening|howdy)/) &&
    userMessage.length < 30
  ) {
    return {
      response:
        "Hello! 👋 I'm your CoolAir AI assistant. I can help you find the perfect air conditioner based on your room size, climate, budget, and energy preferences.\n\nTry asking something like:\n- \"Best AC for 180 sq ft room in Chennai\"\n- \"5-star inverter AC under ₹45,000\"\n- \"Recommend AC for large bedroom, budget ₹50,000\"",
      products: [],
    };
  }

  // Handle help/what can you do
  if (lower.includes("help") || lower.includes("what can you") || lower.includes("how do you")) {
    return {
      response:
        "I can help you:\n\n🌡️ **Find ACs by room size** — Just tell me the sq footage\n🌍 **Location-aware recommendations** — I factor in your city's climate\n⚡ **Energy efficiency matching** — 3-star vs 5-star options\n💰 **Budget-based filtering** — Set a max price\n🏷️ **Brand recommendations** — If you prefer Daikin, LG, Samsung, etc.\n\nExample: *\"Best 5-star AC for 150 sq ft room in Delhi under ₹40,000\"*",
      products: [],
    };
  }

  // Handle price/specification queries without context
  if (
    lower.includes("price") && lower.includes("daikin") && parsed.tonnage === undefined
  ) {
    const daikinProducts = PRODUCTS.filter((p) => p.brand === "Daikin" && p.inStock);
    return {
      response: `Daikin ACs on CoolAir range from ₹${Math.min(...daikinProducts.map(p => p.price)).toLocaleString("en-IN")} to ₹${Math.max(...daikinProducts.map(p => p.price)).toLocaleString("en-IN")}. Here are our available Daikin models:`,
      products: daikinProducts.slice(0, 3),
    };
  }

  // Main recommendation flow
  const recommendations = scoreProducts(PRODUCTS, parsed);

  // No meaningful query detected
  if (
    Object.keys(parsed).length === 0 ||
    (parsed.intent === undefined && !parsed.roomSize && !parsed.budget && !parsed.tonnage)
  ) {
    return {
      response:
        "I'd love to help you find the perfect AC! Could you share some details?\n\n- **Room size** (in sq ft)?\n- **Location/city** for climate considerations?\n- **Budget range** (e.g., ₹30,000–₹50,000)?\n- **Energy preference** (3-star or 5-star)?",
      products: [],
    };
  }

  const response = generateResponse(userMessage, parsed, recommendations);

  return { response, products: recommendations };
}

export const EXAMPLE_QUERIES = [
  "Best AC for 150 sq ft room in Chennai",
  "5-star inverter AC under ₹40,000",
  "Recommend AC for large bedroom, budget ₹60,000",
  "Best Daikin AC for 2 BHK",
  "Energy efficient AC for humid climate",
  "1.5 ton AC under ₹35,000",
];

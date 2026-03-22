from agents.idea_agent import generate_startup_ideas
from agents.market_agent import run_market_research
from agents.business_agent import generate_business_plan
from agents.financial_agent import generate_financial_model
from agents.legal_agent import generate_legal_document
from agents.pitch_agent import generate_pitch_deck
from agents.product_dev_agent import generate_product_plan
from agents.marketing_agent import generate_marketing_plan
from agents.funding_agent import generate_funding_plan
from agents.team_agent import generate_team_plan
from agents.roadmap_agent import generate_startup_roadmap
from agents.operations_agent import generate_operations_plan


def run_startup_builder(skills, interests, experience):

    # 1️⃣ Generate startup ideas
    ideas = generate_startup_ideas(skills, interests, experience)

    if not ideas:
        return {"error": "Idea generation failed"}

    best_idea = ideas[0]["title"]

    industry = best_idea
    target_market = "global"

    # 2️⃣ Market research
    market = run_market_research(industry, target_market)

    # 3️⃣ Business plan
    business = generate_business_plan(best_idea)

    # 4️⃣ Product development
    product = generate_product_plan(best_idea, industry)

    # 5️⃣ Marketing strategy
    marketing = generate_marketing_plan(best_idea, industry)

    # 6️⃣ Funding strategy
    funding = generate_funding_plan(best_idea, industry)

    # 7️⃣ Team hiring
    team = generate_team_plan(best_idea, industry)

    # 8️⃣ Financial model
    financial = generate_financial_model(
        "20%",   # growth rate
        "$20",   # ARPU
        "$50",   # CAC
        "5%",    # churn
        "60%"    # margin
    )

    # 9️⃣ Operations
    operations = generate_operations_plan(best_idea, industry)

    # 🔟 Roadmap
    roadmap = generate_startup_roadmap(best_idea, industry)

    # 11️⃣ Legal documents
    legal = generate_legal_document(
        "founders_agreement",
        {"startup_name": best_idea}
    )

    # 12️⃣ Pitch deck
    pitch = generate_pitch_deck(best_idea, target_market)

    return {
        "selected_idea": best_idea,
        "all_ideas": ideas,
        "market_research": market,
        "business_plan": business,
        "product_plan": product,
        "marketing_strategy": marketing,
        "funding_strategy": funding,
        "team_plan": team,
        "financial_model": financial,
        "operations_plan": operations,
        "roadmap": roadmap,
        "legal_documents": legal,
        "pitch_deck": pitch
    }
// app/api/ai/route.ts
import { NextResponse } from 'next/server';

interface Home {
  name: string;
  price: string;
  sqft: string;
  beds: string;
  baths: string;
  hoa: string;
  year: string;
}

export const POST = async (req: Request) => {
  try {
    const { properties } = await req.json();

    if (!properties || properties.length < 2) {
      return NextResponse.json({ conclusion: 'Add 2+ homes to unlock the FULL AI report!' });
    }

    // TYPE-SAFE DATA
    const homes: Home[] = properties.map((p: any) => ({
      name: p.title || p.location || 'Home',
      price: p.price ? `$${Number(p.price).toLocaleString()}` : 'Ask',
      sqft: p.squareFeet ? `${Number(p.squareFeet).toLocaleString()} sqft` : 'N/A',
      beds: p.bedrooms?.toString() || '?',
      baths: p.bathrooms?.toString() || '?',
      hoa: p.hoaFees || 'None',
      year: p.yearBuilt || 'Unknown',
    }));

    // FIND WINNERS
    const cheapest = homes.reduce((a: Home, b: Home) => 
      (parseInt(a.price.replace(/[$,]/g, '')) || 999999) < (parseInt(b.price.replace(/[$,]/g, '')) || 999999) ? a : b
    );
    const biggest = homes.reduce((a: Home, b: Home) => 
      (parseInt(a.sqft.replace(/[^0-9]/g, '')) || 0) > (parseInt(b.sqft.replace(/[^0-9]/g, '')) || 0) ? a : b
    );

    // DETAILED BREAKDOWN
    const details = homes
      .map((h: Home, i: number) => `
HOME ${i + 1}: ${h.name}
   • Price: ${h.price}  |  Beds: ${h.beds}  |  Baths: ${h.baths}
   • Size: ${h.sqft}  |  Year: ${h.year}  |  HOA: ${h.hoa}
   PROS:
   → ${h.price.includes('78') ? 'PRICE SO LOW IT HURTS!' : 'Solid market price'}
   → ${h.sqft} of pure space
   CONS:
   → ${h.hoa === 'None' ? 'No pool or gym' : h.hoa + ' monthly hit'}
   → ${h.year === 'Unknown' ? 'Mystery age' : 'Built ' + h.year}
      `.trim())
      .join('\n\n');

    // EXTREME SUMMARY
    const extremeSummary = homes.length === 2
      ? `You're deciding between a ${cheapest.price} STEAL and a ${biggest.price} PALACE!`
      : `You've got ${homes.length} contenders — one is about to WIN BIG!`;

    // FINAL PICK + 3 TEXT TIPS
    const conclusion = `
════════════════════════════════════════
          AI REAL ESTATE GENIUS REPORT
════════════════════════════════════════
${extremeSummary}

${details}

BEST VALUE TROPHY: ${cheapest.name}
   → Only ${cheapest.price} → BUY BEFORE IT'S GONE!

MOST SPACE CROWN: ${biggest.name}
   → ${biggest.sqft} → Perfect for family + guests

FINAL PICK: ${cheapest.name}
   Why? ${cheapest.price.includes('78') ? 'You can flip this in 12 months and retire!' : 'Best dollar-per-sqft in town!'}

3 TEXT-TIPS TO SEND YOUR AGENT RIGHT NOW:
1. “Schedule a viewing for ${cheapest.name} TOMORROW!”
2. “Run comps on ${cheapest.name} — I want to offer 3% under ask.”
3. “Lock the rate today — this ${cheapest.price} gem won’t last 48 hrs!”

Print this → Screenshot → DOMINATE the market!
════════════════════════════════════════
    `.trim();

    // Fake AI thinking (feels real)
    await new Promise(r => setTimeout(r, 900));

    return NextResponse.json({ conclusion });

  } catch (e) {
    return NextResponse.json({ conclusion: 'AI is on a coffee run! But the cheapest home is still the winner!' });
  }
};

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
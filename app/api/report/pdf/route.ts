import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET(request: NextRequest) {
  const year = request.nextUrl.searchParams.get('year');
  const month = request.nextUrl.searchParams.get('month');
  const state = request.nextUrl.searchParams.get('state');

  if (!year || !month) {
    return NextResponse.json({ error: 'year and month are required' }, { status: 400 });
  }

  const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });

  try {
    const page = await browser.newPage();
    const origin = request.nextUrl.origin;
    const reportUrl = `${origin}/report/${year}/${month}${state ? `?state=${encodeURIComponent(state)}` : ''}`;

    await page.goto(reportUrl, { waitUntil: 'networkidle' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '18mm',
        right: '14mm',
        bottom: '18mm',
        left: '14mm'
      }
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="mealio-${year}-${month}.pdf"`
      }
    });
  } finally {
    await browser.close();
  }
}

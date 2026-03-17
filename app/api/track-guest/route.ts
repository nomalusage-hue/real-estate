import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      guestId,
      language,
      timezone,
      device_type,
      os,
      browser,
      screen_width,
      screen_height,
      pixel_ratio,
      connection,
      memory,
      touchSupport,
      orientation,
      referrer,
      currentUrl,
      utm,
    } = body;

    // 1. Get IP from headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';

    // 2. Geolocate IP (use a free service; consider caching to avoid rate limits)
    let country = null, city = null;
    if (ip && ip !== 'unknown' && ip !== '::1' && !ip.startsWith('192.168.')) {
      try {
        // ip-api.com is free for non‑commercial use
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
        const geo = await geoRes.json();
        if (geo.country) country = geo.country;
        if (geo.city) city = geo.city;
      } catch (e) {
        console.error('Geolocation error:', e);
      }
    }

    // 3. Prepare data for upsert
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for write access
    );

    // First, get existing guest to increment visit count if needed
    const { data: existing } = await supabase
      .from('guests')
      .select('visit_count')
      .eq('id', guestId)
      .single();

    const visitCount = (existing?.visit_count || 0) + 1;

    const guestData = {
      id: guestId,
      ip,
      country,
      city,
      language,
      timezone,
      device_type,
      os,
      browser,
      screen_width,
      screen_height,
      pixel_ratio,
      connection_type: connection,
      device_memory: memory,
      touch_support: touchSupport,
      screen_orientation: orientation,
      referrer,
      last_seen: new Date().toISOString(),
      visit_count: visitCount,
      // You could also store UTM params in a JSONB column
      utm_params: utm,
      // Optionally store first page viewed
      first_page: existing ? undefined : currentUrl,
    };

    const { error } = await supabase
      .from('guests')
      .upsert(guestData, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
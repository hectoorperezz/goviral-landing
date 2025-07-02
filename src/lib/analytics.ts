// Helper para disparar eventos gtag
export const trackClick = (action: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    const eventValues: { [key: string]: number } = {
      click_ver_mas_header: 1,
      click_ver_planes_hero: 2,
      click_contactar_hero: 1,
      click_collections_instagram: 2,
      click_collections_tiktok: 2,
      click_collections_youtube: 1,
      click_collections_spotify: 1,
      click_collections_instagram_footer: 2,
      click_collections_tiktok_footer: 2,
      click_collections_youtube_footer: 1,
      click_plan_starter_instagram: 3,
      click_plan_influencer_instagram: 4,
      click_plan_enterprise_instagram: 5,
      click_comenzar_ahora: 2,
      click_contacto_footer: 1,
      click_collections_spotify_footer: 1,
      click_prueba_gratis_hero: 2,
      // Tools dropdown tracking
      click_herramienta_proximamente: 1,
      click_herramienta_seguidor_tracker: 3,
      click_herramienta_reelviews_booster: 3,
      click_herramienta_calculadora_de_engagement: 3,
      click_herramienta_generador_de_hashtags: 3,
      click_herramienta_analizador_de_contenido: 3,
      click_herramienta_checklist_de_publicación: 3,
      click_sugerir_herramienta: 2,
    };

    window.gtag("event", action, {
      event_category: "outbound",
      event_label: action,
      value: eventValues[action] || 1,
    });
  }
}; 
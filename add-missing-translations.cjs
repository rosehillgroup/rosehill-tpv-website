const fs = require('fs');

const missingTranslations = {
  // About.html - "Made in Yorkshire"
  "fr:Made in Yorkshire:": "Fabriqué dans le Yorkshire :",
  "de:Made in Yorkshire:": "Hergestellt in Yorkshire:",
  "es:Made in Yorkshire:": "Hecho en Yorkshire:",
  
  // Colour.html - strapline in hero under heading
  "fr:From bold primary colours to subtle earth tones,": "Des couleurs primaires audacieuses aux tons terreux subtils,",
  "de:From bold primary colours to subtle earth tones,": "Von kräftigen Grundfarben bis zu subtilen Erdtönen,",
  "es:From bold primary colours to subtle earth tones,": "Desde colores primarios audaces hasta tonos tierra sutiles,",
  
  // Products.html - strapline in hero under heading
  "fr:Professional-grade rubber granules and polyurethane binders for sports and play surfaces. British-engineered solutions trusted worldwide.": "Granulés de caoutchouc et liants polyuréthane de qualité professionnelle pour surfaces sportives et récréatives. Solutions d'ingénierie britannique reconnues mondialement.",
  "de:Professional-grade rubber granules and polyurethane binders for sports and play surfaces. British-engineered solutions trusted worldwide.": "Professionelle Gummigranulate und Polyurethan-Bindemittel für Sport- und Spielflächen. Britisch entwickelte Lösungen, denen weltweit vertraut wird.",
  "es:Professional-grade rubber granules and polyurethane binders for sports and play surfaces. British-engineered solutions trusted worldwide.": "Gránulos de caucho y aglutinantes de poliuretano de grado profesional para superficies deportivas y recreativas. Soluciones de ingeniería británica confiables mundialmente.",
  
  // Products.html - section under hero (Rosehill TPV/Flexilon)
  "fr:Engineered for Excellence": "Conçu pour l'Excellence",
  "de:Engineered for Excellence": "Entwickelt für Exzellenz",
  "es:Engineered for Excellence": "Diseñado para la Excelencia",
  
  "fr:Our premium TPV rubber granules are manufactured to the highest standards, offering exceptional durability, colour retention, and safety for all surface applications.": "Nos granulés de caoutchouc TPV premium sont fabriqués selon les plus hautes normes, offrant une durabilité exceptionnelle, une rétention des couleurs et une sécurité pour toutes les applications de surface.",
  "de:Our premium TPV rubber granules are manufactured to the highest standards, offering exceptional durability, colour retention, and safety for all surface applications.": "Unsere Premium-TPV-Gummigranulate werden nach höchsten Standards hergestellt und bieten außergewöhnliche Haltbarkeit, Farbbeständigkeit und Sicherheit für alle Oberflächenanwendungen.",
  "es:Our premium TPV rubber granules are manufactured to the highest standards, offering exceptional durability, colour retention, and safety for all surface applications.": "Nuestros gránulos de caucho TPV premium se fabrican con los más altos estándares, ofreciendo durabilidad excepcional, retención de color y seguridad para todas las aplicaciones de superficie.",
  
  "fr:Advanced Bonding Technology": "Technologie de Liaison Avancée",
  "de:Advanced Bonding Technology": "Fortschrittliche Bindetechnologie",
  "es:Advanced Bonding Technology": "Tecnología de Unión Avanzada",
  
  "fr:Flexilon polyurethane binders provide superior adhesion and flexibility, creating long-lasting surfaces that withstand heavy use and extreme weather conditions.": "Les liants polyuréthane Flexilon offrent une adhésion et une flexibilité supérieures, créant des surfaces durables qui résistent à une utilisation intensive et aux conditions météorologiques extrêmes.",
  "de:Flexilon polyurethane binders provide superior adhesion and flexibility, creating long-lasting surfaces that withstand heavy use and extreme weather conditions.": "Flexilon-Polyurethan-Bindemittel bieten überlegene Haftung und Flexibilität und schaffen langlebige Oberflächen, die starker Beanspruchung und extremen Wetterbedingungen standhalten.",
  "es:Flexilon polyurethane binders provide superior adhesion and flexibility, creating long-lasting surfaces that withstand heavy use and extreme weather conditions.": "Los aglutinantes de poliuretano Flexilon proporcionan adhesión y flexibilidad superiores, creando superficies duraderas que resisten el uso intenso y las condiciones climáticas extremas.",
  
  // Products.html - technical specification section
  "fr:All Flexilon®binders are MDI-based": "Tous les liants Flexilon® sont à base de MDI",
  "de:All Flexilon®binders are MDI-based": "Alle Flexilon®-Bindemittel basieren auf MDI",
  "es:All Flexilon®binders are MDI-based": "Todos los aglutinantes Flexilon® están basados en MDI",
  
  "fr:Standard binders may yellow with light": "Les liants standards peuvent jaunir à la lumière",
  "de:Standard binders may yellow with light": "Standardbindemittel können bei Lichteinwirkung vergilben",
  "es:Standard binders may yellow with light": "Los aglutinantes estándar pueden amarillear con la luz",
  
  // Contact.html - Technical Response Guarantee
  "fr:Technical Response Guarantee": "Garantie de Réponse Technique",
  "de:Technical Response Guarantee": "Technische Antwortgarantie",
  "es:Technical Response Guarantee": "Garantía de Respuesta Técnica",
  
  "fr:We guarantee a technical response to all enquiries within 24 hours during business days. Our experienced team is ready to provide expert guidance on product selection, installation methods, and project requirements.": "Nous garantissons une réponse technique à toutes les demandes dans les 24 heures pendant les jours ouvrables. Notre équipe expérimentée est prête à fournir des conseils d'experts sur la sélection de produits, les méthodes d'installation et les exigences du projet.",
  "de:We guarantee a technical response to all enquiries within 24 hours during business days. Our experienced team is ready to provide expert guidance on product selection, installation methods, and project requirements.": "Wir garantieren eine technische Antwort auf alle Anfragen innerhalb von 24 Stunden an Werktagen. Unser erfahrenes Team steht bereit, um fachkundige Beratung bei Produktauswahl, Installationsmethoden und Projektanforderungen zu bieten.",
  "es:We guarantee a technical response to all enquiries within 24 hours during business days. Our experienced team is ready to provide expert guidance on product selection, installation methods, and project requirements.": "Garantizamos una respuesta técnica a todas las consultas dentro de 24 horas durante los días laborables. Nuestro equipo experimentado está listo para proporcionar orientación experta sobre selección de productos, métodos de instalación y requisitos del proyecto."
};

function addMissingTranslations() {
  console.log('📝 Adding missing translations to cache...\n');
  
  // Read existing translation cache
  const cacheFile = 'i18n/translation-cache.json';
  let cache = {};
  
  if (fs.existsSync(cacheFile)) {
    cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }
  
  // Add missing translations
  let addedCount = 0;
  Object.entries(missingTranslations).forEach(([key, value]) => {
    if (!cache[key]) {
      cache[key] = value;
      addedCount++;
      console.log(`✅ Added: ${key} = ${value}`);
    } else {
      console.log(`⚠️  Exists: ${key}`);
    }
  });
  
  // Write back to file with proper formatting
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  
  console.log(`\n📊 Summary:`);
  console.log(`- Added ${addedCount} new translations`);
  console.log(`- Total translations in cache: ${Object.keys(cache).length}`);
  console.log(`\n✅ Translation cache updated!`);
  
  return { addedCount, totalTranslations: Object.keys(cache).length };
}

// Run if called directly
if (require.main === module) {
  addMissingTranslations();
}

module.exports = { addMissingTranslations };
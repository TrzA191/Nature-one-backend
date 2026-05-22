'use strict';

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    try {
      console.log('=== INICIANDO CONFIGURACIÓN DE SEMILLADO (SEEDING) ===');
      
      // 1. Limpiar productos y categorías existentes para asegurar consistencia
      const existingProducts = await strapi.documents('api::product.product').find({ limit: 100 });
      for (const prod of existingProducts) {
        await strapi.documents('api::product.product').delete({ documentId: prod.documentId });
      }
      console.log('Productos antiguos eliminados.');

      const existingCategories = await strapi.documents('api::category.category').find({ limit: 100 });
      for (const cat of existingCategories) {
        await strapi.documents('api::category.category').delete({ documentId: cat.documentId });
      }
      console.log('Categorías antiguas eliminadas.');

      // 2. Crear Categorías en estado publicado
      const categoryAlimentos = await strapi.documents('api::category.category').create({
        data: {
          categoryName: 'Alimentos',
          slug: 'alimentos',
        },
        status: 'published'
      });
      
      const categoryBebidas = await strapi.documents('api::category.category').create({
        data: {
          categoryName: 'Bebidas',
          slug: 'bebidas',
        },
        status: 'published'
      });

      const categoryCuidado = await strapi.documents('api::category.category').create({
        data: {
          categoryName: 'Cuidado Personal',
          slug: 'cuidado-personal',
        },
        status: 'published'
      });

      console.log('Nuevas categorías creadas con éxito.');

      // 3. Definir Productos relacionados usando su documentId (4 productos por categoría, total 12)
      const productsData = [
        // ALIMENTOS
        {
          productName: 'Miel de Abeja Multifloral',
          slug: 'miel-de-abeja-multifloral',
          description: 'Miel de abeja 100% pura y orgánica multifloral, cosechada artesanalmente de apiarios sustentables.',
          price: 120.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: true,
          active: true,
          category: categoryAlimentos.documentId,
        },
        {
          productName: 'Harina de Almendras Fina',
          slug: 'harina-de-almendras-fina',
          description: 'Harina de almendras finamente molida sin piel, ideal para repostería keto, sin gluten y saludable.',
          price: 150.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: false,
          active: true,
          category: categoryAlimentos.documentId,
        },
        {
          productName: 'Aceite de Coco Orgánico',
          slug: 'aceite-de-coco-organico',
          description: 'Aceite de coco extra virgen prensado en frío, 100% orgánico, ideal para cocina y cuidado personal.',
          price: 130.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: true,
          active: true,
          category: categoryAlimentos.documentId,
        },
        {
          productName: 'Granola Artesanal con Semillas',
          slug: 'granola-artesanal-con-semillas',
          description: 'Granola horneada a baja temperatura con miel de abeja, almendras, nueces y semillas de calabaza.',
          price: 90.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: false,
          active: true,
          category: categoryAlimentos.documentId,
        },

        // BEBIDAS
        {
          productName: 'Café Orgánico de Altura',
          slug: 'cafe-organico-de-altura',
          description: 'Café de grano entero orgánico, cultivado a la sombra en Chiapas. Con notas sutiles de chocolate y almendras.',
          price: 180.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: true,
          active: true,
          category: categoryBebidas.documentId,
        },
        {
          productName: 'Té Verde Matcha Premium',
          slug: 'te-verde-matcha-premium',
          description: 'Té verde matcha en polvo de grado ceremonial, cultivado orgánicamente y rico en antioxidantes.',
          price: 320.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: false,
          active: true,
          category: categoryBebidas.documentId,
        },
        {
          productName: 'Kombucha de Jengibre y Limón',
          slug: 'kombucha-de-jengibre-y-limon',
          description: 'Bebida fermentada kombucha natural, refrescante, burbujeante y excelente para la salud digestiva.',
          price: 65.00,
          origin: 'México',
          taste: 'Agrio',
          isFeatured: true,
          active: true,
          category: categoryBebidas.documentId,
        },
        {
          productName: 'Infusión de Manzanilla y Lavanda',
          slug: 'infusion-de-manzanilla-y-lavanda',
          description: 'Mezcla herbal relajante de flores de manzanilla orgánica y lavanda premium, ideal para antes de dormir.',
          price: 45.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: false,
          active: true,
          category: categoryBebidas.documentId,
        },

        // CUIDADO PERSONAL
        {
          productName: 'Shampoo Sólido de Romero',
          slug: 'shampoo-solido-de-romero',
          description: 'Shampoo en barra natural formulado con aceite esencial de romero para fortalecer y dar brillo al cabello.',
          price: 95.00,
          origin: 'México',
          taste: 'Agrio',
          isFeatured: true,
          active: true,
          category: categoryCuidado.documentId,
        },
        {
          productName: 'Jabón Artesanal de Avena y Miel',
          slug: 'jabon-artesanal-de-avena-y-miel',
          description: 'Jabón corporal natural elaborado con avena entera exfoliante y miel de abeja pura para hidratar la piel.',
          price: 60.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: false,
          active: true,
          category: categoryCuidado.documentId,
        },
        {
          productName: 'Crema Facial de Aloe Vera',
          slug: 'crema-facial-de-aloe-vera',
          description: 'Crema hidratante facial de rápida absorción, formulada con gel puro de aloe vera orgánico y vitamina E.',
          price: 175.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: true,
          active: true,
          category: categoryCuidado.documentId,
        },
        {
          productName: 'Desodorante Natural de Coco',
          slug: 'desodorante-natural-de-coco',
          description: 'Desodorante ecológico libre de aluminio, alcohol y parabenos, con aroma suave a coco y karité.',
          price: 85.00,
          origin: 'México',
          taste: 'Dulce',
          isFeatured: false,
          active: true,
          category: categoryCuidado.documentId,
        }
      ];

      // 4. Crear Productos en estado publicado
      for (const product of productsData) {
        await strapi.documents('api::product.product').create({
          data: product,
          status: 'published'
        });
      }

      console.log('Productos creados y vinculados con éxito.');
      console.log('=== SEMILLADO COMPLETADO ===');
    } catch (err) {
      console.error('Error al semillar la base de datos:', err);
    }
  },
};

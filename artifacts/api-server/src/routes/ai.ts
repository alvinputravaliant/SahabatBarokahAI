import { Router, type IRouter } from "express";
import { db, generationsTable } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../lib/auth.js";
import { checkAndIncrementUsage } from "../lib/usageLimiter.js";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

async function generateAIContent(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  return response.choices[0]?.message?.content || "";
}

router.post("/strategy", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const usage = await checkAndIncrementUsage(req.userId!);
    if (!usage.allowed) {
      res.status(429).json({
        error: `Batas penggunaan harian tercapai (${usage.limit} generasi/hari). Upgrade ke Pro untuk penggunaan unlimited.`,
      });
      return;
    }

    const { businessType, targetMarket, budget } = req.body;
    if (!businessType || !targetMarket || !budget) {
      res.status(400).json({ error: "businessType, targetMarket, and budget are required" });
      return;
    }

    const systemPrompt = `Kamu adalah konsultan bisnis Ramadan berpengalaman untuk UMKM Indonesia. 
Selalu jawab dalam Bahasa Indonesia yang mudah dipahami.
Gunakan format Markdown dengan heading, bullet point, dan struktur yang jelas.
Berikan saran yang praktis, spesifik, dan dapat langsung diterapkan.`;

    const userPrompt = `Buatkan strategi bisnis Ramadan yang komprehensif untuk:
- Jenis Bisnis: ${businessType}
- Target Pasar: ${targetMarket}
- Budget: ${budget}

Format output HARUS menggunakan struktur berikut:

## Strategi Bisnis Ramadan

### Gambaran Peluang
[Penjelasan peluang bisnis selama Ramadan]

### Posisi Pasar
• [target pembeli]
• [alasan mereka tertarik]
• [potensi permintaan]

### 5 Ide Produk Ramadan
• [ide produk 1]
• [ide produk 2]
• [ide produk 3]
• [ide produk 4]
• [ide produk 5]

### 3 Strategi Promosi
• [strategi promosi 1]
• [strategi promosi 2]
• [strategi promosi 3]

### 5 Ide Konten Sosial Media
• [ide konten 1]
• [ide konten 2]
• [ide konten 3]
• [ide konten 4]
• [ide konten 5]

### Rencana Eksekusi 7 Hari
**Hari 1:** [aktivitas]
**Hari 2:** [aktivitas]
**Hari 3:** [aktivitas]
**Hari 4:** [aktivitas]
**Hari 5:** [aktivitas]
**Hari 6:** [aktivitas]
**Hari 7:** [aktivitas]`;

    const result = await generateAIContent(systemPrompt, userPrompt);

    const [generation] = await db.insert(generationsTable).values({
      userId: req.userId!,
      tool: "strategy",
      input: { businessType, targetMarket, budget },
      result,
    }).returning();

    res.json({
      id: generation.id,
      tool: generation.tool,
      input: generation.input,
      result: generation.result,
      createdAt: generation.createdAt,
    });
  } catch (err) {
    console.error("Strategy generation error:", err);
    res.status(500).json({ error: "Gagal generate strategi. Coba lagi." });
  }
});

router.post("/menu", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const usage = await checkAndIncrementUsage(req.userId!);
    if (!usage.allowed) {
      res.status(429).json({
        error: `Batas penggunaan harian tercapai (${usage.limit} generasi/hari). Upgrade ke Pro untuk penggunaan unlimited.`,
      });
      return;
    }

    const { foodType, targetCustomer, priceRange } = req.body;
    if (!foodType || !targetCustomer || !priceRange) {
      res.status(400).json({ error: "foodType, targetCustomer, and priceRange are required" });
      return;
    }

    const systemPrompt = `Kamu adalah food consultant dan marketing expert spesialis kuliner viral Indonesia.
Selalu jawab dalam Bahasa Indonesia yang mudah dipahami.
Gunakan format Markdown dengan heading, bullet point, dan struktur yang jelas.
Fokus pada tren kuliner viral, estetika visual, dan potensi bisnis.`;

    const userPrompt = `Buatkan ide menu viral Ramadan untuk:
- Jenis Makanan: ${foodType}
- Target Konsumen: ${targetCustomer}
- Range Harga: ${priceRange}

Format output HARUS menggunakan struktur berikut:

## Ide Menu Viral

### Konsep Menu
[Penjelasan konsep menu yang menarik]

### 5 Ide Menu Viral
**Menu 1: [nama menu]**
[deskripsi singkat]

**Menu 2: [nama menu]**
[deskripsi singkat]

**Menu 3: [nama menu]**
[deskripsi singkat]

**Menu 4: [nama menu]**
[deskripsi singkat]

**Menu 5: [nama menu]**
[deskripsi singkat]

### Kenapa Menu Bisa Viral
• [alasan 1]
• [alasan 2]
• [alasan 3]

### Ide Presentasi Visual
• **Ide Plating:** [ide kreatif plating]
• **Ide Foto Produk:** [konsep foto yang menarik]
• **Ide Video TikTok:** [konsep video viral]`;

    const result = await generateAIContent(systemPrompt, userPrompt);

    const [generation] = await db.insert(generationsTable).values({
      userId: req.userId!,
      tool: "menu",
      input: { foodType, targetCustomer, priceRange },
      result,
    }).returning();

    res.json({
      id: generation.id,
      tool: generation.tool,
      input: generation.input,
      result: generation.result,
      createdAt: generation.createdAt,
    });
  } catch (err) {
    console.error("Menu generation error:", err);
    res.status(500).json({ error: "Gagal generate menu. Coba lagi." });
  }
});

router.post("/profit", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const usage = await checkAndIncrementUsage(req.userId!);
    if (!usage.allowed) {
      res.status(429).json({
        error: `Batas penggunaan harian tercapai (${usage.limit} generasi/hari). Upgrade ke Pro untuk penggunaan unlimited.`,
      });
      return;
    }

    const { productName, costPerItem, sellingPrice, estimatedDailySales } = req.body;
    if (!productName || costPerItem === undefined || sellingPrice === undefined || estimatedDailySales === undefined) {
      res.status(400).json({ error: "productName, costPerItem, sellingPrice, and estimatedDailySales are required" });
      return;
    }

    const profitPerItem = sellingPrice - costPerItem;
    const dailyRevenue = sellingPrice * estimatedDailySales;
    const dailyProfit = profitPerItem * estimatedDailySales;
    const ramadanProfit = dailyProfit * 30;
    const marginPercentage = ((profitPerItem / sellingPrice) * 100).toFixed(1);

    const systemPrompt = `Kamu adalah financial advisor dan business consultant untuk UMKM Indonesia.
Selalu jawab dalam Bahasa Indonesia yang mudah dipahami.
Gunakan format Markdown dengan heading, bullet point, dan struktur yang jelas.
Berikan analisis yang akurat dan tips praktis meningkatkan profit.`;

    const userPrompt = `Buatkan analisis profit yang detail untuk produk berikut:
- Nama Produk: ${productName}
- Modal per Item: Rp ${Number(costPerItem).toLocaleString("id-ID")}
- Harga Jual: Rp ${Number(sellingPrice).toLocaleString("id-ID")}
- Estimasi Penjualan Harian: ${estimatedDailySales} unit

Data kalkulasi:
- Profit per Item: Rp ${profitPerItem.toLocaleString("id-ID")}
- Pendapatan Harian: Rp ${dailyRevenue.toLocaleString("id-ID")}
- Profit Harian: Rp ${dailyProfit.toLocaleString("id-ID")}
- Profit 30 Hari (Ramadan): Rp ${ramadanProfit.toLocaleString("id-ID")}
- Margin: ${marginPercentage}%

Format output HARUS menggunakan struktur berikut:

## Analisis Profit Produk

### Profit per Item
[Penjelasan perhitungan keuntungan per produk dengan data di atas]

### Estimasi Pendapatan Harian
[Total revenue harian dengan penjelasan]

### Estimasi Profit Harian
[Profit bersih per hari dengan penjelasan]

### Estimasi Profit Ramadan (30 Hari)
[Total potensi keuntungan selama Ramadan]

### Analisis Margin
[Analisis apakah margin sudah bagus dan perbandingan industri]

### Tips Meningkatkan Profit
• [tips spesifik 1]
• [tips spesifik 2]
• [tips spesifik 3]
• [tips spesifik 4]
• [tips spesifik 5]`;

    const result = await generateAIContent(systemPrompt, userPrompt);

    const [generation] = await db.insert(generationsTable).values({
      userId: req.userId!,
      tool: "profit",
      input: { productName, costPerItem, sellingPrice, estimatedDailySales },
      result,
    }).returning();

    res.json({
      id: generation.id,
      tool: generation.tool,
      input: generation.input,
      result: generation.result,
      createdAt: generation.createdAt,
    });
  } catch (err) {
    console.error("Profit generation error:", err);
    res.status(500).json({ error: "Gagal generate analisis profit. Coba lagi." });
  }
});

router.post("/marketing", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const usage = await checkAndIncrementUsage(req.userId!);
    if (!usage.allowed) {
      res.status(429).json({
        error: `Batas penggunaan harian tercapai (${usage.limit} generasi/hari). Upgrade ke Pro untuk penggunaan unlimited.`,
      });
      return;
    }

    const { productName, promotionType, targetAudience } = req.body;
    if (!productName || !promotionType || !targetAudience) {
      res.status(400).json({ error: "productName, promotionType, and targetAudience are required" });
      return;
    }

    const systemPrompt = `Kamu adalah digital marketing expert spesialis konten viral Indonesia.
Selalu jawab dalam Bahasa Indonesia yang mudah dipahami dan engaging.
Gunakan format Markdown dengan heading, bullet point, dan struktur yang jelas.
Buat konten yang relevan dengan kultur Indonesia dan tren media sosial lokal.`;

    const userPrompt = `Buatkan strategi konten marketing Ramadan untuk:
- Nama Produk: ${productName}
- Jenis Promosi: ${promotionType}
- Target Audiens: ${targetAudience}

Format output HARUS menggunakan struktur berikut:

## Strategi Konten Marketing

### Konsep Konten
[Strategi marketing yang komprehensif]

### 5 Ide Konten Viral
• **Ide 1:** [judul dan deskripsi konten]
• **Ide 2:** [judul dan deskripsi konten]
• **Ide 3:** [judul dan deskripsi konten]
• **Ide 4:** [judul dan deskripsi konten]
• **Ide 5:** [judul dan deskripsi konten]

### 3 Contoh Caption

**Caption 1 (Instagram):**
[caption lengkap dengan emoji dan hashtag]

**Caption 2 (TikTok):**
[caption lengkap dengan trend TikTok]

**Caption 3 (WhatsApp Story):**
[caption singkat tapi powerful]

### Call To Action
• **CTA 1:** [call to action yang mengena]
• **CTA 2:** [call to action alternatif]
• **CTA 3:** [call to action untuk urgency]

### Tips Platform
• **Instagram:** [tips spesifik]
• **TikTok:** [tips spesifik]
• **WhatsApp:** [tips spesifik]`;

    const result = await generateAIContent(systemPrompt, userPrompt);

    const [generation] = await db.insert(generationsTable).values({
      userId: req.userId!,
      tool: "marketing",
      input: { productName, promotionType, targetAudience },
      result,
    }).returning();

    res.json({
      id: generation.id,
      tool: generation.tool,
      input: generation.input,
      result: generation.result,
      createdAt: generation.createdAt,
    });
  } catch (err) {
    console.error("Marketing generation error:", err);
    res.status(500).json({ error: "Gagal generate konten marketing. Coba lagi." });
  }
});

export default router;

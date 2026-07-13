"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    // ── Store Profile ──────────────────────────────────────────
    console.log('📦 Seeding store profile...');
    await prisma.storeProfile.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'TB Mulya Abadi',
            description: 'Toko Bangunan Mulya Abadi menyediakan berbagai kebutuhan material bangunan berkualitas tinggi dengan harga terjangkau. Melayani kebutuhan konstruksi rumah, gedung, dan renovasi.',
            address: 'Jl. Gatot Subroto No.113',
            city: 'Pemalang',
            province: 'Jawa Tengah',
            postalCode: '52319',
            phone: '+62287-321456',
            email: 'info@tbmulyaabadi.com',
            website: 'https://tbmulyaabadi.com',
            openMonFri: '07:30-17:00',
            openSaturday: '07:30-17:00',
            openSunday: '07:30-14:00',
            isDeliveryFree: true,
            deliveryNote: 'Gratis ongkos kirim untuk area Kota Pemalang',
            whatsappNumber: '+6281234567890',
            instagramUrl: 'https://instagram.com/tbmulyaabadi',
            facebookUrl: 'https://facebook.com/tbmulyaabadi',
        },
    });
    // ── Roles ──────────────────────────────────────────────────
    console.log('🔑 Seeding roles...');
    const roles = [
        { id: '00000000-0000-0000-0000-000000000010', name: 'ADMIN', description: 'Administrator dengan akses penuh ke semua fitur' },
        { id: '00000000-0000-0000-0000-000000000011', name: 'USER', description: 'Pengguna reguler dengan akses terbatas' },
    ];
    for (const role of roles) {
        await prisma.role_.upsert({ where: { name: role.name }, update: {}, create: role });
    }
    // ── Admin & Users ──────────────────────────────────────────
    console.log('👤 Seeding users...');
    const saltRounds = 12;
    const adminPassword = await bcrypt_1.default.hash('Admin123!', saltRounds);
    const userPassword = await bcrypt_1.default.hash('User123!', saltRounds);
    await prisma.user.upsert({
        where: { email: 'admin@tbmulyaabadi.com' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000020',
            name: 'Administrator',
            email: 'admin@tbmulyaabadi.com',
            password: adminPassword,
            phone: '+6281234567890',
            address: 'Jl. Gatot Subroto No.113, Pemalang',
            role: 'ADMIN',
            isActive: true,
        },
    });
    const userSeedData = [
        { id: '00000000-0000-0000-0000-000000000021', name: 'Budi Santoso', email: 'user@tbmulyaabadi.com', phone: '+6281234567891', address: 'Jl. Ahmad Yani No. 45, Pemalang' },
        { id: '00000000-0000-0000-0000-000000000022', name: 'Siti Rahayu', email: 'siti@example.com', phone: '+6281234567892', address: 'Jl. Diponegoro No. 12, Pemalang' },
        { id: '00000000-0000-0000-0000-000000000023', name: 'Ahmad Fauzi', email: 'ahmad@example.com', phone: '+6281234567893', address: 'Jl. Sudirman No. 67, Pemalang' },
        { id: '00000000-0000-0000-0000-000000000024', name: 'Dewi Lestari', email: 'dewi@example.com', phone: '+6281234567894', address: 'Jl. Pemuda No. 23, Pemalang' },
        { id: '00000000-0000-0000-0000-000000000025', name: 'Rudi Hermawan', email: 'rudi@example.com', phone: '+6281234567895', address: 'Jl. Merdeka No. 89, Pemalang' },
    ];
    for (const u of userSeedData) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: { ...u, password: userPassword, role: 'USER', isActive: true },
        });
    }
    // ── Categories ─────────────────────────────────────────────
    console.log('📂 Seeding categories...');
    const categoryData = [
        { id: '00000000-0000-0000-0000-000000000030', name: 'Semen', slug: 'semen', description: 'Berbagai jenis semen untuk konstruksi dan bangunan', sortOrder: 1 },
        { id: '00000000-0000-0000-0000-000000000031', name: 'Bata', slug: 'bata', description: 'Bata merah, bata ringan, dan batako untuk dinding', sortOrder: 2 },
        { id: '00000000-0000-0000-0000-000000000032', name: 'Atap', slug: 'atap', description: 'Genteng, seng, dan berbagai material atap bangunan', sortOrder: 3 },
        { id: '00000000-0000-0000-0000-000000000033', name: 'Cat', slug: 'cat', description: 'Cat tembok, cat kayu, cat besi, dan cat dekoratif', sortOrder: 4 },
        { id: '00000000-0000-0000-0000-000000000034', name: 'Besi', slug: 'besi', description: 'Besi beton, besi hollow, besi siku, dan profil baja', sortOrder: 5 },
        { id: '00000000-0000-0000-0000-000000000035', name: 'Keramik', slug: 'keramik', description: 'Keramik lantai, keramik dinding, dan granit', sortOrder: 6 },
        { id: '00000000-0000-0000-0000-000000000036', name: 'Pipa PVC', slug: 'pipa-pvc', description: 'Pipa PVC untuk instalasi air dan sanitasi', sortOrder: 7 },
        { id: '00000000-0000-0000-0000-000000000037', name: 'Kayu', slug: 'kayu', description: 'Kayu balok, triplek, papan, dan material kayu lainnya', sortOrder: 8 },
        { id: '00000000-0000-0000-0000-000000000038', name: 'Pasir', slug: 'pasir', description: 'Pasir bangunan, pasir halus, dan pasir cor', sortOrder: 9 },
        { id: '00000000-0000-0000-0000-000000000039', name: 'Kerikil', slug: 'kerikil', description: 'Kerikil cor, split batu, dan agregat kasar', sortOrder: 10 },
        { id: '00000000-0000-0000-0000-000000000040', name: 'Listrik', slug: 'listrik', description: 'Kabel listrik, saklar, stopkontak, dan instalasi listrik', sortOrder: 11 },
        { id: '00000000-0000-0000-0000-000000000041', name: 'Alat', slug: 'alat', description: 'Alat pertukangan, alat ukur, dan perlengkapan kerja', sortOrder: 12 },
        { id: '00000000-0000-0000-0000-000000000042', name: 'Peralatan Air', slug: 'peralatan-air', description: 'Pompa air, kran, shower, dan perlengkapan sanitasi', sortOrder: 13 },
    ];
    for (const cat of categoryData) {
        await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: { ...cat, isActive: true } });
    }
    // ── Products ───────────────────────────────────────────────
    console.log('🏗️ Seeding products...');
    const products = [
        // SEMEN
        {
            id: '00000000-0000-0000-0001-000000000001', name: 'Semen Portland Tipe I Holcim 50kg', slug: 'semen-portland-tipe-i-holcim-50kg',
            description: 'Semen Portland Tipe I Holcim 50kg cocok untuk konstruksi umum seperti pondasi, kolom, balok, dan dinding beton. Kualitas terjamin dengan standar SNI.',
            price: 68000, stock: 500, weight: 50, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Semen+Portland+Holcim',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000030',
        },
        {
            id: '00000000-0000-0000-0001-000000000002', name: 'Semen Portland Tiga Roda 50kg', slug: 'semen-portland-tiga-roda-50kg',
            description: 'Semen Portland Tiga Roda 50kg dengan kualitas premium untuk berbagai kebutuhan konstruksi. Menghasilkan beton yang kuat dan tahan lama.',
            price: 66000, stock: 450, weight: 50, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Semen+Tiga+Roda',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000030',
        },
        {
            id: '00000000-0000-0000-0001-000000000003', name: 'Semen Putih Tiga Roda 40kg', slug: 'semen-putih-tiga-roda-40kg',
            description: 'Semen putih berkualitas tinggi untuk acian, nat keramik, dan dekorasi. Menghasilkan permukaan yang halus dan putih bersih.',
            price: 125000, stock: 200, weight: 40, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/f5f5f5/333333?text=Semen+Putih',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000030',
        },
        {
            id: '00000000-0000-0000-0001-000000000004', name: 'Semen Instan MU-300 (Plester) 40kg', slug: 'semen-instan-mu-300-plester-40kg',
            description: 'Mortar instan siap pakai untuk plesteran dinding. Hemat waktu dan tenaga dengan kualitas yang konsisten dan kuat.',
            price: 85000, stock: 300, weight: 40, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/e8e8e8/333333?text=Semen+Instan+MU',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000030',
        },
        // BATA
        {
            id: '00000000-0000-0000-0001-000000000005', name: 'Bata Merah Press 5x11x22cm (per biji)', slug: 'bata-merah-press-5x11x22cm',
            description: 'Bata merah press berkualitas tinggi ukuran standar 5x11x22cm. Diproduksi dengan tanah liat pilihan, kuat dan tahan lama untuk dinding rumah.',
            price: 800, stock: 50000, weight: 2.5, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/8B4513/ffffff?text=Bata+Merah',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000031',
        },
        {
            id: '00000000-0000-0000-0001-000000000006', name: 'Bata Ringan Hebel 10x20x60cm (per pcs)', slug: 'bata-ringan-hebel-10x20x60cm',
            description: 'Bata ringan AAC (Autoclaved Aerated Concrete) Hebel ukuran 10x20x60cm. Ringan, kuat, dan memiliki insulasi panas yang baik.',
            price: 12500, stock: 5000, weight: 8.5, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/d3d3d3/333333?text=Bata+Ringan+Hebel',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000031',
        },
        {
            id: '00000000-0000-0000-0001-000000000007', name: 'Batako Press 10x20x40cm (per pcs)', slug: 'batako-press-10x20x40cm',
            description: 'Batako press abu-abu ukuran 10x20x40cm. Alternatif ekonomis pengganti bata merah dengan kekuatan yang baik.',
            price: 3500, stock: 20000, weight: 7, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/808080/ffffff?text=Batako+Press',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000031',
        },
    ];
    const moreProducts = [
        // ATAP
        {
            id: '00000000-0000-0000-0001-000000000008', name: 'Genteng Keramik KIA Premium (per pcs)', slug: 'genteng-keramik-kia-premium',
            description: 'Genteng keramik KIA Premium dengan lapisan glasir yang tahan terhadap cuaca dan lumut. Cocok untuk rumah modern dengan tampilan elegan.',
            price: 8500, stock: 10000, weight: 2.8, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/8B0000/ffffff?text=Genteng+KIA',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000032',
        },
        {
            id: '00000000-0000-0000-0001-000000000009', name: 'Atap Seng BJLS Gelombang 0.25mm (lembar 3m)', slug: 'atap-seng-bjls-gelombang-025mm-3m',
            description: 'Seng gelombang BJLS 0.25mm panjang 3 meter untuk atap ekonomis. Ringan, tahan karat, dan mudah dipasang.',
            price: 125000, stock: 2000, weight: 8, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/708090/ffffff?text=Seng+Gelombang',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000032',
        },
        // CAT
        {
            id: '00000000-0000-0000-0001-000000000010', name: 'Cat Tembok Dulux Pentalite 5kg Putih', slug: 'cat-tembok-dulux-pentalite-5kg-putih',
            description: 'Cat tembok Dulux Pentalite 5kg warna putih. Tahan cuci, tahan jamur, dan menghasilkan warna yang cerah dan merata. Cocok untuk interior.',
            price: 145000, stock: 300, weight: 5, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/F5F5F5/333333?text=Cat+Dulux+Putih',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000033',
        },
        {
            id: '00000000-0000-0000-0001-000000000011', name: 'Cat Tembok Nippon Paint Weatherbond 20kg', slug: 'cat-tembok-nippon-paint-weatherbond-20kg',
            description: 'Cat tembok eksterior Nippon Paint Weatherbond 20kg. Tahan cuaca ekstrem, anti-jamur, dan warna tahan pudar hingga 10 tahun.',
            price: 520000, stock: 150, weight: 20, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/2196F3/ffffff?text=Nippon+Weatherbond',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000033',
        },
        {
            id: '00000000-0000-0000-0001-000000000012', name: 'Cat Besi Avian 1kg Hitam', slug: 'cat-besi-avian-1kg-hitam',
            description: 'Cat besi anti karat Avian 1kg warna hitam. Melindungi permukaan besi dan baja dari korosi dengan daya lekat yang kuat.',
            price: 38000, stock: 500, weight: 1, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/212121/ffffff?text=Cat+Besi+Avian',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000033',
        },
        // BESI
        {
            id: '00000000-0000-0000-0001-000000000013', name: 'Besi Beton Polos SNI D10 x 12m', slug: 'besi-beton-polos-sni-d10-12m',
            description: 'Besi beton polos SNI diameter 10mm panjang 12 meter. Kuat tarik tinggi untuk tulangan beton pondasi dan struktur bangunan.',
            price: 125000, stock: 1000, weight: 7.4, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/555555/ffffff?text=Besi+Beton+D10',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000034',
        },
        {
            id: '00000000-0000-0000-0001-000000000014', name: 'Besi Beton Ulir SNI D13 x 12m', slug: 'besi-beton-ulir-sni-d13-12m',
            description: 'Besi beton ulir (deformed bar) SNI diameter 13mm panjang 12 meter. Daya rekat lebih baik dengan beton untuk konstruksi yang lebih kuat.',
            price: 210000, stock: 800, weight: 12.5, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/444444/ffffff?text=Besi+Beton+D13',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000034',
        },
        // KERAMIK
        {
            id: '00000000-0000-0000-0001-000000000015', name: 'Keramik Lantai Roman 40x40cm (per dus 5 pcs)', slug: 'keramik-lantai-roman-40x40cm',
            description: 'Keramik lantai Roman ukuran 40x40cm motif putih polos. Permukaan glossy yang mudah dibersihkan, cocok untuk ruang tamu dan kamar.',
            price: 85000, stock: 2000, weight: 12, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/F8F8FF/333333?text=Keramik+Roman',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000035',
        },
        {
            id: '00000000-0000-0000-0001-000000000016', name: 'Granit Lantai Platinum 60x60cm Glossy (per pcs)', slug: 'granit-lantai-platinum-60x60cm-glossy',
            description: 'Granit lantai Platinum ukuran 60x60cm dengan finishing glossy. Tampilan mewah dan elegan untuk hunian premium.',
            price: 95000, stock: 3000, weight: 16, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/E8E8E8/333333?text=Granit+Platinum',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000035',
        },
    ];
    const evenMoreProducts = [
        // PIPA PVC
        {
            id: '00000000-0000-0000-0001-000000000017', name: 'Pipa PVC Wavin AW 1/2" x 4m', slug: 'pipa-pvc-wavin-aw-setengah-inch-4m',
            description: 'Pipa PVC Wavin kelas AW (tebal) diameter 1/2 inch panjang 4 meter. Untuk instalasi air bersih dengan tekanan tinggi.',
            price: 22000, stock: 5000, weight: 1.2, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/1565C0/ffffff?text=Pipa+PVC+Wavin',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000036',
        },
        {
            id: '00000000-0000-0000-0001-000000000018', name: 'Pipa PVC Rucika 4" x 4m (Tipe D)', slug: 'pipa-pvc-rucika-4-inch-4m-tipe-d',
            description: 'Pipa PVC Rucika diameter 4 inch panjang 4 meter tipe D untuk saluran pembuangan dan drainase. Tahan korosi dan awet.',
            price: 145000, stock: 1500, weight: 5.5, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/0D47A1/ffffff?text=Pipa+Rucika+4inch',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000036',
        },
        // KAYU
        {
            id: '00000000-0000-0000-0001-000000000019', name: 'Triplek Meranti 12mm 122x244cm', slug: 'triplek-meranti-12mm-122x244cm',
            description: 'Plywood/triplek kayu meranti tebal 12mm ukuran standar 122x244cm. Untuk bekisting cor, dinding, dan furniture.',
            price: 185000, stock: 800, weight: 18, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/8B4513/ffffff?text=Triplek+Meranti',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000037',
        },
        {
            id: '00000000-0000-0000-0001-000000000020', name: 'Kayu Balok Meranti 5x10x400cm', slug: 'kayu-balok-meranti-5x10x400cm',
            description: 'Balok kayu meranti merah ukuran 5x10cm panjang 4 meter. Kuat untuk rangka atap, kuda-kuda, dan struktur bangunan.',
            price: 95000, stock: 600, weight: 8, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/6B3A2A/ffffff?text=Kayu+Balok+Meranti',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000037',
        },
        // PASIR
        {
            id: '00000000-0000-0000-0001-000000000021', name: 'Pasir Bangunan (per m3)', slug: 'pasir-bangunan-per-m3',
            description: 'Pasir bangunan berkualitas untuk campuran adukan semen. Bersih dari lumpur dan kerikil besar. Cocok untuk plesteran dan pondasi.',
            price: 350000, stock: 200, weight: 1600, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/D2B48C/333333?text=Pasir+Bangunan',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000038',
        },
        {
            id: '00000000-0000-0000-0001-000000000022', name: 'Pasir Halus/Pasir Ayak (per m3)', slug: 'pasir-halus-per-m3',
            description: 'Pasir halus sudah diayak untuk acian dan finishing dinding. Butiran halus dan bersih menghasilkan permukaan yang rata.',
            price: 420000, stock: 150, weight: 1500, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/C2A77D/333333?text=Pasir+Halus',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000038',
        },
        // KERIKIL
        {
            id: '00000000-0000-0000-0001-000000000023', name: 'Kerikil / Batu Split 1-2cm (per m3)', slug: 'kerikil-batu-split-1-2cm-per-m3',
            description: 'Batu split/kerikil ukuran 1-2cm untuk campuran beton cor. Kualitas baik, bersih, dan keras untuk konstruksi bangunan.',
            price: 450000, stock: 180, weight: 1800, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/808080/ffffff?text=Kerikil+Split',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000039',
        },
        // LISTRIK
        {
            id: '00000000-0000-0000-0001-000000000024', name: 'Kabel NYM 3x2.5mm Supreme 50m', slug: 'kabel-nym-3x2-5mm-supreme-50m',
            description: 'Kabel listrik NYM 3 core x 2.5mm merk Supreme panjang 50 meter. Standar SNI untuk instalasi listrik rumah tangga.',
            price: 385000, stock: 400, weight: 7, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/FF6F00/ffffff?text=Kabel+NYM+Supreme',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000040',
        },
        {
            id: '00000000-0000-0000-0001-000000000025', name: 'Saklar Ganda Broco Inbow', slug: 'saklar-ganda-broco-inbow',
            description: 'Saklar ganda (double switch) Broco tanam (inbow) untuk instalasi listrik. Desain modern, tahan lama, dan mudah dipasang.',
            price: 25000, stock: 1000, weight: 0.15, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/ECEFF1/333333?text=Saklar+Broco',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000040',
        },
        // ALAT
        {
            id: '00000000-0000-0000-0001-000000000026', name: 'Meteran Gulung Stanley 5m', slug: 'meteran-gulung-stanley-5m',
            description: 'Meteran pita Stanley 5 meter dengan pengunci otomatis. Skala mm/inch, mudah dibaca, dan tahan benturan untuk penggunaan di lapangan.',
            price: 65000, stock: 300, weight: 0.3, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/FFD600/333333?text=Meteran+Stanley',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000041',
        },
        {
            id: '00000000-0000-0000-0001-000000000027', name: 'Kunci Pas Set 12 pcs Tekiro', slug: 'kunci-pas-set-12-pcs-tekiro',
            description: 'Set kunci pas kombinasi Tekiro 12 pcs ukuran 6-22mm. Bahan chrome vanadium, kuat dan tahan karat untuk berbagai keperluan.',
            price: 285000, stock: 150, weight: 2.5, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/F57C00/ffffff?text=Kunci+Pas+Tekiro',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000041',
        },
        // PERALATAN AIR
        {
            id: '00000000-0000-0000-0001-000000000028', name: 'Pompa Air Shimizu PS-128BIT 125W', slug: 'pompa-air-shimizu-ps-128bit-125w',
            description: 'Pompa air otomatis Shimizu PS-128BIT daya 125 Watt. Debit 35 liter/menit, cocok untuk rumah tinggal dengan kebutuhan air sedang.',
            price: 475000, stock: 100, weight: 7, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/0288D1/ffffff?text=Pompa+Shimizu',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000042',
        },
        {
            id: '00000000-0000-0000-0001-000000000029', name: 'Kran Air Stainless 1/2" SAN-EI', slug: 'kran-air-stainless-san-ei',
            description: 'Kran air stainless steel SAN-EI ukuran 1/2 inch. Anti karat, awet, dan mengalirkan air dengan lancar. Cocok untuk dapur dan kamar mandi.',
            price: 85000, stock: 500, weight: 0.5, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/B0BEC5/333333?text=Kran+SAN-EI',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000042',
        },
    ];
    const additionalProducts = [
        {
            id: '00000000-0000-0000-0001-000000000030', name: 'Semen Gresik 50kg', slug: 'semen-gresik-50kg',
            description: 'Semen Portland merk Gresik 50kg. Salah satu merek semen terpercaya di Indonesia dengan kualitas tinggi untuk berbagai kebutuhan konstruksi.',
            price: 67000, stock: 600, weight: 50, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Semen+Gresik',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000030',
        },
        {
            id: '00000000-0000-0000-0001-000000000031', name: 'Genteng Beton Monier (per pcs)', slug: 'genteng-beton-monier',
            description: 'Genteng beton Monier yang kuat dan tahan lama. Tahan gempa dan tahan terhadap perubahan cuaca ekstrem.',
            price: 7500, stock: 8000, weight: 3.5, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/5D4037/ffffff?text=Genteng+Monier',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000032',
        },
        {
            id: '00000000-0000-0000-0001-000000000032', name: 'Cat Tembok Mowilex Weathercoat 25kg', slug: 'cat-tembok-mowilex-weathercoat-25kg',
            description: 'Cat eksterior Mowilex Weathercoat 25kg. Formula hydrophobic advanced melindungi dinding dari air hujan, lumut, dan jamur.',
            price: 680000, stock: 120, weight: 25, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/E91E63/ffffff?text=Mowilex+Weathercoat',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000033',
        },
        {
            id: '00000000-0000-0000-0001-000000000033', name: 'Hollow Besi 4x4x120cm (per batang)', slug: 'hollow-besi-4x4x120cm',
            description: 'Pipa besi hollow ukuran 4x4cm panjang 120cm tebal 1.2mm. Untuk rangka kanopi, pagar, dan konstruksi ringan.',
            price: 45000, stock: 2000, weight: 3.8, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/607D8B/ffffff?text=Hollow+Besi',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000034',
        },
        {
            id: '00000000-0000-0000-0001-000000000034', name: 'Keramik Dinding 25x40cm KIA (per dus)', slug: 'keramik-dinding-25x40cm-kia',
            description: 'Keramik dinding KIA ukuran 25x40cm untuk kamar mandi dan dapur. Surface glossy, mudah dibersihkan, tahan noda.',
            price: 72000, stock: 1500, weight: 14, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/E3F2FD/333333?text=Keramik+Dinding+KIA',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000035',
        },
        {
            id: '00000000-0000-0000-0001-000000000035', name: 'Elbow PVC 90° 1/2" Wavin (per pcs)', slug: 'elbow-pvc-90-wavin',
            description: 'Sambungan siku/elbow PVC Wavin 90 derajat ukuran 1/2 inch. Untuk instalasi pipa air bersih, tahan tekanan dan tidak berkarat.',
            price: 3500, stock: 10000, weight: 0.05, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/1A237E/ffffff?text=Elbow+PVC',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000036',
        },
        {
            id: '00000000-0000-0000-0001-000000000036', name: 'GRC Board 9mm 120x240cm', slug: 'grc-board-9mm-120x240cm',
            description: 'GRC Board (Glassfiber Reinforced Cement) 9mm ukuran 120x240cm. Untuk partisi, plafon, dan dinding eksterior. Tahan air dan api.',
            price: 165000, stock: 600, weight: 22, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/BDBDBD/333333?text=GRC+Board',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000037',
        },
        {
            id: '00000000-0000-0000-0001-000000000037', name: 'Batu Bata Ekspos/Bata Muka (per biji)', slug: 'bata-ekspos-bata-muka',
            description: 'Bata ekspos/bata muka dengan permukaan yang rapi untuk tampilan dinding ekspos yang estetis. Cocok untuk desain industrial modern.',
            price: 1200, stock: 30000, weight: 2.8, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/B71C1C/ffffff?text=Bata+Ekspos',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000031',
        },
        {
            id: '00000000-0000-0000-0001-000000000038', name: 'Kabel NYY 2x2.5mm Eterna 100m', slug: 'kabel-nyy-2x2-5mm-eterna-100m',
            description: 'Kabel listrik NYY 2 core x 2.5mm merk Eterna panjang 100m. Untuk instalasi listrik bawah tanah atau tanam. Standar SNI.',
            price: 580000, stock: 200, weight: 14, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/E65100/ffffff?text=Kabel+NYY+Eterna',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000040',
        },
        {
            id: '00000000-0000-0000-0001-000000000039', name: 'Tangga Aluminium 5 Tingkat Lipat', slug: 'tangga-aluminium-5-tingkat-lipat',
            description: 'Tangga aluminium lipat 5 tingkat, tinggi maksimum 150cm. Ringan namun kuat, kapasitas beban hingga 150kg. Anti slip.',
            price: 385000, stock: 80, weight: 4.5, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/9E9E9E/333333?text=Tangga+Aluminium',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000041',
        },
        {
            id: '00000000-0000-0000-0001-000000000040', name: 'Shower Set Tanam TOTO TX432SVC', slug: 'shower-set-tanam-toto',
            description: 'Shower set tanam merk TOTO dengan shower kepala hujan dan hand shower. Material stainless steel anti karat dan tahan lama.',
            price: 1250000, stock: 50, weight: 2, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/4FC3F7/333333?text=Shower+TOTO',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000042',
        },
        {
            id: '00000000-0000-0000-0001-000000000041', name: 'Waterproofing Aquaproof 4kg', slug: 'waterproofing-aquaproof-4kg',
            description: 'Bahan waterproofing Aquaproof 4kg untuk atap, talang, dak beton, dan basement. Elastis, mudah diaplikasikan, dan tahan cuaca.',
            price: 125000, stock: 350, weight: 4, isFeatured: true,
            imageUrl: 'https://placehold.co/600x400/00BCD4/ffffff?text=Aquaproof+4kg',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000030',
        },
        {
            id: '00000000-0000-0000-0001-000000000042', name: 'Gypsum Board Jaya Board 9mm (per lembar)', slug: 'gypsum-board-jaya-board-9mm',
            description: 'Papan gypsum Jaya Board 9mm ukuran 120x240cm untuk plafon dan partisi interior. Ringan, mudah dipotong, dan permukaan halus.',
            price: 75000, stock: 700, weight: 11, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/FAFAFA/333333?text=Gypsum+Board',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000037',
        },
        {
            id: '00000000-0000-0000-0001-000000000043', name: 'Pasir Cor/Pasir Kasar (per m3)', slug: 'pasir-cor-pasir-kasar-per-m3',
            description: 'Pasir kasar khusus untuk cor beton. Tekstur kasar dan bersih memberikan campuran beton yang padat dan kuat.',
            price: 380000, stock: 160, weight: 1700, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/A1887F/ffffff?text=Pasir+Cor',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000038',
        },
        {
            id: '00000000-0000-0000-0001-000000000044', name: 'Besi Wiremesh M8 2.1x5.4m', slug: 'besi-wiremesh-m8-2-1x5-4m',
            description: 'Wiremesh besi ulir M8 ukuran 2.1x5.4 meter. Untuk pelat lantai beton dan jalan beton dengan pemasangan yang lebih cepat.',
            price: 450000, stock: 500, weight: 47, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/333333/ffffff?text=Wiremesh+M8',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000034',
        },
        {
            id: '00000000-0000-0000-0001-000000000045', name: 'Cat Dasar/Plamir Tembok Avian 4kg', slug: 'cat-dasar-plamir-tembok-avian-4kg',
            description: 'Cat dasar plamir tembok Avian 4kg untuk meratakan permukaan sebelum pengecatan. Mengisi pori-pori tembok dan memberikan daya lekat yang baik.',
            price: 68000, stock: 400, weight: 4, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/ECEFF1/333333?text=Cat+Dasar+Avian',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000033',
        },
        {
            id: '00000000-0000-0000-0001-000000000046', name: 'Paku Beton 2.5cm (per kg)', slug: 'paku-beton-2-5cm-per-kg',
            description: 'Paku beton ukuran 2.5cm per kilogram. Untuk pemasangan pada beton, tembok, dan material keras lainnya.',
            price: 18000, stock: 2000, weight: 1, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/78909C/ffffff?text=Paku+Beton',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000041',
        },
        {
            id: '00000000-0000-0000-0001-000000000047', name: 'Floor Drain Stainless 10x10cm (per pcs)', slug: 'floor-drain-stainless-10x10cm',
            description: 'Floor drain/saringan lantai stainless steel ukuran 10x10cm. Anti karat, anti tersumbat, dan tampilan modern.',
            price: 45000, stock: 800, weight: 0.3, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/CFD8DC/333333?text=Floor+Drain',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000042',
        },
        {
            id: '00000000-0000-0000-0001-000000000048', name: 'Kerikil Putih/Koral Putih (per 50kg)', slug: 'kerikil-putih-koral-putih-per-50kg',
            description: 'Kerikil/koral putih 50kg untuk dekorasi taman, lapangan parkir, dan drainase. Bersih dan estetis.',
            price: 120000, stock: 300, weight: 50, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/F5F5F5/333333?text=Koral+Putih',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000039',
        },
        {
            id: '00000000-0000-0000-0001-000000000049', name: 'Genteng Metal Pasir Prima (per lembar)', slug: 'genteng-metal-pasir-prima',
            description: 'Genteng metal berpasir Prima panjang 4 meter. Ringan, kuat, anti karat, dan tahan terhadap angin kencang. Cocok untuk bangunan modern.',
            price: 185000, stock: 1200, weight: 7, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/607D8B/ffffff?text=Genteng+Metal',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000032',
        },
        {
            id: '00000000-0000-0000-0001-000000000050', name: 'Papan Kayu Bengkirai 3x20x400cm', slug: 'papan-kayu-bengkirai-3x20x400cm',
            description: 'Papan kayu bengkirai/yellow balau tebal 3cm lebar 20cm panjang 4 meter. Keras, tahan cuaca, dan cocok untuk decking outdoor dan jembatan.',
            price: 275000, stock: 400, weight: 22, isFeatured: false,
            imageUrl: 'https://placehold.co/600x400/4E342E/ffffff?text=Kayu+Bengkirai',
            status: client_1.ProductStatus.ACTIVE, categoryId: '00000000-0000-0000-0000-000000000037',
        },
    ];
    const allProducts = [...products, ...moreProducts, ...evenMoreProducts, ...additionalProducts];
    for (const product of allProducts) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: { ...product, price: product.price, viewCount: Math.floor(Math.random() * 500) },
        });
    }
    // ── Banners ─────────────────────────────────────────────────
    console.log('🖼️ Seeding banners...');
    const banners = [
        {
            id: '00000000-0000-0000-0002-000000000001',
            title: 'Promo Akhir Tahun - Diskon Hingga 30%',
            subtitle: 'Dapatkan harga terbaik untuk semua material bangunan pilihan',
            imageUrl: 'https://placehold.co/1200x400/E53935/ffffff?text=Promo+Akhir+Tahun',
            linkUrl: '/products?featured=true',
            isActive: true, sortOrder: 1,
        },
        {
            id: '00000000-0000-0000-0002-000000000002',
            title: 'Gratis Ongkos Kirim Se-Kota Pemalang',
            subtitle: 'Pesan material bangunan sekarang, gratis antar ke lokasi Anda',
            imageUrl: 'https://placehold.co/1200x400/1565C0/ffffff?text=Gratis+Ongkir+Pemalang',
            linkUrl: '/products',
            isActive: true, sortOrder: 2,
        },
        {
            id: '00000000-0000-0000-0002-000000000003',
            title: 'Produk Besi & Baja Terlengkap',
            subtitle: 'Besi beton, wiremesh, hollow, dan profil baja tersedia lengkap',
            imageUrl: 'https://placehold.co/1200x400/37474F/ffffff?text=Produk+Besi+Baja',
            linkUrl: '/products?category=besi',
            isActive: true, sortOrder: 3,
        },
        {
            id: '00000000-0000-0000-0002-000000000004',
            title: 'Keramik & Granit Pilihan',
            subtitle: 'Ribuan motif keramik dan granit untuk hunian impian Anda',
            imageUrl: 'https://placehold.co/1200x400/4A148C/ffffff?text=Keramik+Granit',
            linkUrl: '/products?category=keramik',
            isActive: true, sortOrder: 4,
        },
        {
            id: '00000000-0000-0000-0002-000000000005',
            title: 'TB Mulya Abadi - Terpercaya Sejak 1995',
            subtitle: 'Melayani kebutuhan material bangunan Anda dengan sepenuh hati',
            imageUrl: 'https://placehold.co/1200x400/2E7D32/ffffff?text=TB+Mulya+Abadi',
            linkUrl: '/about',
            isActive: true, sortOrder: 5,
        },
    ];
    for (const banner of banners) {
        await prisma.banner.upsert({
            where: { id: banner.id },
            update: {},
            create: banner,
        });
    }
    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('   - 1 Store Profile');
    console.log('   - 2 Roles (ADMIN, USER)');
    console.log('   - 1 Admin + 5 Users');
    console.log('   - 13 Categories');
    console.log('   - 50 Products');
    console.log('   - 5 Banners');
    console.log('');
    console.log('🔐 Admin Login: admin@tbmulyaabadi.com / Admin123!');
    console.log('👤 User Login:  user@tbmulyaabadi.com / User123!');
}
main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
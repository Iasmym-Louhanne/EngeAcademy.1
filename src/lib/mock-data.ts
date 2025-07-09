export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'NR' | 'CIPA' | 'Primeiros Socorros' | 'Outros';
  price: number;
  duration: string; // e.g., "10 horas"
  workload: string; // e.g., "40 horas"
  imageUrl: string;
  videoPreviewUrl: string;
  hasCertificate: boolean;
};

export type CoursePackage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  courseIds: string[];
  imageUrl: string;
};

export const courses: Course[] = [
  {
    id: '1',
    slug: 'nr-35-trabalho-em-altura',
    title: 'NR 35 - Trabalho em Altura',
    description: 'Curso completo sobre as normas e práticas de segurança para trabalho em altura, conforme a NR 35. Essencial para a construção civil e indústria.',
    category: 'NR',
    price: 149.9,
    duration: '8 horas',
    workload: '16 horas',
    imageUrl: 'https://images.unsplash.com/photo-1581092448348-a5562d355448?q=80&w=1974&auto=format&fit=crop',
    videoPreviewUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    hasCertificate: true,
  },
  {
    id: '2',
    slug: 'cipa-designado',
    title: 'CIPA - Formação de Designado',
    description: 'Treinamento para o designado da CIPA, abordando a prevenção de acidentes e doenças decorrentes do trabalho.',
    category: 'CIPA',
    price: 99.9,
    duration: '20 horas',
    workload: '20 horas',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop',
    videoPreviewUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    hasCertificate: true,
  },
  {
    id: '3',
    slug: 'primeiros-socorros-basico',
    title: 'Primeiros Socorros - Básico',
    description: 'Aprenda as técnicas fundamentais de primeiros socorros para atuar em situações de emergência no ambiente de trabalho e no dia a dia.',
    category: 'Primeiros Socorros',
    price: 79.9,
    duration: '4 horas',
    workload: '8 horas',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
    videoPreviewUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    hasCertificate: true,
  },
  {
    id: '4',
    slug: 'nr-10-seguranca-em-eletricidade',
    title: 'NR 10 - Segurança em Eletricidade',
    description: 'Curso obrigatório para profissionais que interagem com instalações elétricas e serviços com eletricidade.',
    category: 'NR',
    price: 199.9,
    duration: '40 horas',
    workload: '40 horas',
    imageUrl: 'https://images.unsplash.com/photo-1487875961445-47a00398c267?q=80&w=2070&auto=format&fit=crop',
    videoPreviewUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    hasCertificate: false,
  },
];

export const packages: CoursePackage[] = [
    {
        id: 'pkg-1',
        slug: 'pacote-seguranca-total',
        title: 'Pacote Segurança Total',
        description: 'Um pacote completo com os principais cursos de NR para garantir a conformidade e segurança da sua equipe.',
        price: 399.9,
        courseIds: ['1', '4'],
        imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    }
]
export const courses = [
  {
    id: 'nr35',
    title: 'NR 35 - Trabalho em Altura',
    slug: 'nr-35-trabalho-em-altura',
    description: 'Capacitação completa para trabalhos em altura conforme a Norma Regulamentadora 35.',
    duration: '8 horas',
    price: 120.00,
    thumbnail: '/images/nr35-thumb.jpg',
    featured: true,
    tags: ['segurança', 'normas', 'certificação']
  },
  {
    id: 'nr33',
    title: 'NR 33 - Espaços Confinados',
    slug: 'nr-33-espacos-confinados',
    description: 'Treinamento para trabalho seguro em espaços confinados de acordo com a NR 33.',
    duration: '16 horas',
    price: 180.00,
    thumbnail: '/images/nr33-thumb.jpg',
    featured: true,
    tags: ['segurança', 'normas', 'certificação']
  },
  {
    id: 'nr10',
    title: 'NR 10 - Segurança em Instalações Elétricas',
    slug: 'nr-10-seguranca-eletrica',
    description: 'Curso completo sobre segurança em instalações e serviços com eletricidade.',
    duration: '40 horas',
    price: 250.00,
    thumbnail: '/images/nr10-thumb.jpg',
    featured: false,
    tags: ['segurança', 'elétrica', 'normas']
  },
  {
    id: 'primeiros-socorros',
    title: 'Primeiros Socorros',
    slug: 'primeiros-socorros',
    description: 'Aprenda técnicas essenciais de primeiros socorros para situações de emergência.',
    duration: '8 horas',
    price: 90.00,
    thumbnail: '/images/primeiros-socorros-thumb.jpg',
    featured: false,
    tags: ['saúde', 'emergência', 'certificação']
  }
];

export const employees = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    department: 'Manutenção',
    branch: 'São Paulo',
    companyId: '1',
    status: 'active',
    courses: [
      { courseId: 'nr35', progress: 75, completed: false },
      { courseId: 'nr10', progress: 100, completed: true }
    ]
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@empresa.com',
    department: 'Produção',
    branch: 'Rio de Janeiro',
    companyId: '1',
    status: 'active',
    courses: [
      { courseId: 'nr33', progress: 50, completed: false },
      { courseId: 'primeiros-socorros', progress: 100, completed: true }
    ]
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos.santos@empresa.com',
    department: 'Elétrica',
    branch: 'São Paulo',
    companyId: '1',
    status: 'pending',
    courses: [
      { courseId: 'nr10', progress: 90, completed: false },
      { courseId: 'nr35', progress: 100, completed: true }
    ]
  },
  {
    id: '4',
    name: 'Ana Souza',
    email: 'ana.souza@empresa.com',
    department: 'Segurança',
    branch: 'Belo Horizonte',
    companyId: '2',
    status: 'active',
    courses: [
      { courseId: 'primeiros-socorros', progress: 80, completed: false },
      { courseId: 'nr33', progress: 100, completed: true }
    ]
  }
];

export const branches = [
  { id: '1', name: 'São Paulo', employees: 120, courses: 18, address: 'Av. Paulista, 1000' },
  { id: '2', name: 'Rio de Janeiro', employees: 85, courses: 12, address: 'Av. Rio Branco, 500' },
  { id: '3', name: 'Belo Horizonte', employees: 65, courses: 10, address: 'Av. Afonso Pena, 2000' },
  { id: '4', name: 'Salvador', employees: 45, courses: 8, address: 'Av. Tancredo Neves, 1500' }
];

export const companies = [
  { 
    id: '1', 
    name: 'Construções ABC', 
    cnpj: '12.345.678/0001-90',
    billingType: 'recorrente' as 'recorrente' | 'pontual',
    branchId: '1',
    branches: ['São Paulo', 'Rio de Janeiro'], 
    totalEmployees: 205,
    activeCourses: 8,
    logo: '/images/company-1.png'
  },
  { 
    id: '2', 
    name: 'Indústria XYZ', 
    cnpj: '98.765.432/0001-10',
    billingType: 'pontual' as 'recorrente' | 'pontual',
    branchId: '2',
    branches: ['Belo Horizonte', 'Salvador'], 
    totalEmployees: 110,
    activeCourses: 6,
    logo: '/images/company-2.png'
  },
  { 
    id: '3', 
    name: 'Engenharia Delta', 
    cnpj: '11.222.333/0001-44',
    billingType: 'pontual' as 'recorrente' | 'pontual',
    branchId: undefined, // Empresa sem filial associada
    branches: ['Curitiba'], 
    totalEmployees: 50,
    activeCourses: 4,
    logo: '/images/company-3.png'
  }
];

export const vouchers = [
  { code: 'TREINA2023', discount: 15, expires: '2023-12-31', used: false },
  { code: 'SEGURANCA10', discount: 10, expires: '2023-10-15', used: false },
  { code: 'WELCOME20', discount: 20, expires: '2023-11-30', used: true }
];

export const certificates = [
  { 
    id: '1', 
    employeeId: '1', 
    courseId: 'nr10', 
    issueDate: '2023-05-12', 
    expiryDate: '2025-05-12',
    authCode: 'AUTH-123456'
  },
  { 
    id: '2', 
    employeeId: '2', 
    courseId: 'primeiros-socorros', 
    issueDate: '2023-06-18', 
    expiryDate: '2025-06-18',
    authCode: 'AUTH-234567'
  },
  { 
    id: '3', 
    employeeId: '3', 
    courseId: 'nr35', 
    issueDate: '2023-04-05', 
    expiryDate: '2025-04-05',
    authCode: 'AUTH-345678'
  },
  { 
    id: '4', 
    employeeId: '4', 
    courseId: 'nr33', 
    issueDate: '2023-07-22', 
    expiryDate: '2025-07-22',
    authCode: 'AUTH-456789'
  }
];

export const salesData = [
  { month: 'Jan', revenue: 15000 },
  { month: 'Fev', revenue: 18000 },
  { month: 'Mar', revenue: 22000 },
  { month: 'Abr', revenue: 21000 },
  { month: 'Mai', revenue: 25000 },
  { month: 'Jun', revenue: 28000 },
  { month: 'Jul', revenue: 30000 },
  { month: 'Ago', revenue: 32000 },
  { month: 'Set', revenue: 28000 },
  { month: 'Out', revenue: 29000 },
  { month: 'Nov', revenue: 33000 },
  { month: 'Dez', revenue: 38000 }
];
export interface Post {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  featuredImageUrl?: string
  readingTimeMinutes: number
  status: 'DRAFT' | 'PENDING_REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string
  authorId: string
  categoryId?: string
  viewCount: number
  createdAt: string
  updatedAt: string
  author?: Author
  category?: Category
  tags?: Tag[]
}

export interface Author {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  role: 'AUTHOR' | 'ADMIN' | 'EDITOR' | 'SUBSCRIBER'
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export const samplePosts: Post[] = [
  {
    id: 1,
    title: 'Next.js 15 နှင့် စတင်ခြင်း',
    slug: 'getting-started-with-nextjs-15',
    summary: 'Next.js 15 ကို အသုံးပြု၍ ခေတ်မီ web application များ တည်ဆောက်ခြင်းအတွက် ပြီးပြည့်စုံသော လမ်းညွှန်။',
    content: `# Next.js 15 နှင့် စတင်ခြင်း

Next.js 15 သည် စိတ်လှုပ်ရှားဖွယ်ရာ feature သစ်များနှင့် တိုးတက်မှုများကို ယူဆောင်လာပေးပါသည်။ ဤလမ်းညွှန်တွင်၊ အဓိက အပြောင်းအလဲများနှင့် ၎င်းတို့ကို သင့် project များတွင် မည်သို့ အသုံးချရမည်ကို လေ့လာသွားမည်ဖြစ်ပါသည်။

## Next.js 15 တွင် ဘာတွေအသစ်ပါလဲ

### ၁။ ပိုမိုကောင်းမွန်သော Performance
Next.js 15 တွင် အထူးသဖြင့် server components နှင့် data fetching များအတွက် သိသာထင်ရှားသော performance တိုးတက်မှုများ ပါဝင်ပါသည်။

### ၂။ ပိုမိုကောင်းမွန်သော Developer အတွေ့အကြုံ
ပိုမိုကောင်းမွန်သော error message များ၊ တိုးတက်လာသော TypeScript အထောက်အပံ့နှင့် debugging tool အသစ်များ။

### ၃။ Feature အသစ်များ
- Partial Prerendering
- ပိုမိုကောင်းမွန်သော App Router
- ပိုမိုကောင်းမွန်သော Turbopack integration`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    readingTimeMinutes: 8,
    status: 'PUBLISHED',
    publishedAt: '2024-09-15T00:00:00Z',
    authorId: 'user_author_001',
    categoryId: 'cat_web_dev',
    viewCount: 1250,
    createdAt: '2024-09-15T00:00:00Z',
    updatedAt: '2024-09-15T00:00:00Z',
    author: {
      id: 'user_author_001',
      name: 'John Author',
      email: 'author@topicloom.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      bio: 'နည်းပညာစာရေးဆရာ နှင့် ဆော့ဖ်ဝဲလ် developer',
      role: 'AUTHOR',
    },
    category: {
      id: 'cat_web_dev',
      name: 'Web Development',
      slug: 'web-development',
      description: 'Frontend၊ backend နှင့် full-stack development သင်ခန်းစာများ။',
    },
    tags: [
      { id: 'tag_nextjs', name: 'Next.js', slug: 'nextjs' },
      { id: 'tag_typescript', name: 'TypeScript', slug: 'typescript' },
    ],
  },
  {
    id: 2,
    title: 'OpenAI API ဖြင့် AI Application များ တည်ဆောက်ခြင်း',
    slug: 'building-ai-applications-with-openai-api',
    summary: 'သင့် application များတွင် OpenAI API ကို မည်သို့ ပေါင်းစပ်ရမည်နှင့် စွမ်းအားပြည့် AI feature များ မည်သို့ တည်ဆောက်ရမည်ကို လေ့လာပါ။',
    content: `# OpenAI API ဖြင့် AI Application များ တည်ဆောက်ခြင်း

OpenAI API သည် developer များအနေဖြင့် ၎င်းတို့၏ application များတွင် AI ကို ပေါင်းစပ်ရာတွင် ကြီးမားသောပြောင်းလဲမှုကို ဖြစ်ပေါ်စေခဲ့ပါသည်။ ဤ tutorial တွင်၊ ပြီးပြည့်စုံသော AI-powered application တစ်ခုကို တည်ဆောက်ပါမည်။

## စတင်ပြင်ဆင်ခြင်း

ပထမဦးစွာ၊ သင်သည် OpenAI API key တစ်ခု လိုအပ်ပါမည်။ စတင်ရန် platform.openai.com တွင် အကောင့်ဖွင့်ပါ။

## အခြေခံ ပေါင်းစပ်ခြင်း

ဤသည်မှာ API ကို အသုံးပြုထားသော ရိုးရှင်းသော ဥပမာတစ်ခု ဖြစ်သည်-

\`\`\`javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Hello!" }],
});
\`\`\`

## အဆင့်မြင့် Feature များ

Streaming response များ၊ function calling နှင့် အခြားအရာများကို ဆက်လက်လေ့လာသွားပါမည်။`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    readingTimeMinutes: 12,
    status: 'PUBLISHED',
    publishedAt: '2024-09-20T00:00:00Z',
    authorId: 'user_author_002',
    categoryId: 'cat_ai_ml',
    viewCount: 890,
    createdAt: '2024-09-20T00:00:00Z',
    updatedAt: '2024-09-20T00:00:00Z',
    author: {
      id: 'user_author_002',
      name: 'Sarah Writer',
      email: 'sarah@topicloom.com',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      bio: 'Web development ကို အထူးပြုသော အလွတ်တန်း စာရေးဆရာ။',
      role: 'AUTHOR',
    },
    category: {
      id: 'cat_ai_ml',
      name: 'AI & Machine Learning',
      slug: 'ai-machine-learning',
      description: 'Artificial intelligence နှင့် ML ဆိုင်ရာ အောင်မြင်မှုများ။',
    },
    tags: [
      { id: 'tag_ml', name: 'Machine Learning', slug: 'machine-learning' },
      { id: 'tag_openai', name: 'OpenAI', slug: 'openai' },
    ],
  },
  {
    id: 3,
    title: 'Production အတွက် Docker အကောင်းဆုံး အလေ့အကျင့်များ',
    slug: 'docker-best-practices-for-production',
    summary: 'Production environment များတွင် application များ deploy လုပ်ရန်အတွက် မရှိမဖြစ်လိုအပ်သော Docker အလေ့အကျင့်များ။',
    content: `# Production အတွက် Docker အကောင်းဆုံး အလေ့အကျင့်များ

Docker ဖြင့် deploy လုပ်နေပါသလား? ဤသည်မှာ သင်လိုက်နာသင့်သော အကောင်းဆုံး အလေ့အကျင့်များ ဖြစ်ပါသည်။

## ၁။ Multi-stage Builds များကို အသုံးပြုပါ
Multi-stage builds များသည် သင့်နောက်ဆုံး image ကို သေးငယ်စေပြီး လုံခြုံစေရန် ကူညီပေးပါသည်။

## ၂။ Layer အရေအတွက်ကို လျှော့ချပါ
Layer အရေအတွက်ကို လျှော့ချရန် RUN command များကို ပေါင်းစပ်အသုံးပြုပါ။

## ၃။ Root အနေဖြင့် မသုံးပါနှင့်
သင်၏ Dockerfile တွင် non-root user တစ်ဦးကို အမြဲတမ်း ဖန်တီးပါ။

## ၄။ Vulnerabilities များကို Scan ဖတ်ပါ
သင့် image များရှိ လုံခြုံရေးပြဿနာများကို scan ဖတ်ရန် Trivy ကဲ့သို့သော tool များကို အသုံးပြုပါ။`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    readingTimeMinutes: 6,
    status: 'PUBLISHED',
    publishedAt: '2024-09-25T00:00:00Z',
    authorId: 'user_author_001',
    categoryId: 'cat_devops',
    viewCount: 654,
    createdAt: '2024-09-25T00:00:00Z',
    updatedAt: '2024-09-25T00:00:00Z',
    author: {
      id: 'user_author_001',
      name: 'John Author',
      email: 'author@topicloom.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      bio: 'နည်းပညာစာရေးဆရာ နှင့် ဆော့ဖ်ဝဲလ် developer',
      role: 'AUTHOR',
    },
    category: {
      id: 'cat_devops',
      name: 'DevOps',
      slug: 'devops',
      description: 'CI/CD၊ cloud infrastructure နှင့် deployment နည်းဗျူဟာများ။',
    },
    tags: [
      { id: 'tag_docker', name: 'Docker', slug: 'docker' },
      { id: 'tag_kubernetes', name: 'Kubernetes', slug: 'kubernetes' },
    ],
  },
]
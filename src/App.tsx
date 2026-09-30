import React, { useState, useEffect, useRef, useId } from 'react';
import {
  Sparkles,
  Send,
  Linkedin,
  Twitter,
  Instagram,
  Copy,
  Check,
  Edit3,
  RotateCw,
  Share2,
  FileDown,
  Printer,
  Image as ImageIcon,
  X,
  Plus,
  Trash2,
  Clock,
  Flame,
  TrendingUp,
  Settings,
  History,
  Sliders,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Hash,
  ChevronRight,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Eye,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- TYPES & INTERFACES ---

type Platform = 'linkedin' | 'twitter' | 'instagram';
type ToneType = 'viral' | 'thought_leader' | 'founder' | 'genz' | 'educational';

interface PostVariations {
  linkedin: {
    hook: string;
    body: string;
    bulletPoints: string[];
    callToAction: string;
    hashtags: string[];
    estimatedReadTime: string;
  };
  twitter: {
    tweets: string[];
    hashtags: string[];
  };
  instagram: {
    hook: string;
    caption: string;
    hashtags: string[];
    firstCommentTip: string;
  };
}

interface DraftRecord {
  id: string;
  title: string;
  rawIdea: string;
  imageUrl: string | null;
  imageLabel: string | null;
  tone: ToneType;
  createdAt: string;
  variations: PostVariations;
  genZRoast: {
    comment: string;
    badge: string;
    vibeScore: number;
  };
  insights: {
    bestTime: string;
    bestDays: string;
    expectedBoost: string;
  };
}

// --- CURATED PRESET IMAGES (SVG Data URLs for 100% reliable, zero-broken rendering) ---

const SAMPLE_PRESET_IMAGES = [
  {
    id: 'desk-setup',
    label: 'Dark Creator Desk',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231E1538"/><stop offset="50%" stop-color="%230F0D1C"/><stop offset="100%" stop-color="%232D154B"/></linearGradient><linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23A855F7"/><stop offset="100%" stop-color="%23EC4899"/></linearGradient></defs><rect width="600" height="400" fill="url(%23bg)"/><rect x="120" y="70" width="360" height="210" rx="8" fill="%23151226" stroke="%23A855F7" stroke-width="2"/><rect x="140" y="90" width="320" height="170" rx="4" fill="%230B0914"/><line x1="160" y1="120" x2="300" y2="120" stroke="%23A855F7" stroke-width="3" stroke-linecap="round"/><line x1="160" y1="140" x2="250" y2="140" stroke="%236B7280" stroke-width="2"/><line x1="160" y1="160" x2="280" y2="160" stroke="%236B7280" stroke-width="2"/><line x1="160" y1="180" x2="220" y2="180" stroke="%236B7280" stroke-width="2"/><rect x="270" y="280" width="60" height="40" fill="%2325203D"/><rect x="230" y="320" width="140" height="8" rx="4" fill="%233A3359"/><rect x="160" y="340" width="280" height="36" rx="6" fill="%231F1B33" stroke="%234A4268" stroke-width="1"/><circle cx="500" cy="330" r="16" fill="%23A855F7" opacity="0.8"/><circle cx="500" cy="330" r="28" fill="%23A855F7" opacity="0.15"/><text x="300" y="38" fill="%23E2E8F0" font-family="sans-serif" font-weight="600" font-size="14" text-anchor="middle">CREATOR LAB / SETUP</text></svg>',
  },
  {
    id: 'studio-coffee',
    label: 'Espresso & Code',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="cf" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231E1210"/><stop offset="50%" stop-color="%23110E1C"/><stop offset="100%" stop-color="%2326162D"/></linearGradient></defs><rect width="600" height="400" fill="url(%23cf)"/><circle cx="200" cy="200" r="85" fill="%23291B16" stroke="%23D97706" stroke-width="3"/><circle cx="200" cy="200" r="65" fill="%23170E0A"/><ellipse cx="200" cy="200" rx="35" ry="30" fill="%23B45309" opacity="0.8"/><path d="M265,175 C295,175 295,225 265,225" fill="none" stroke="%23D97706" stroke-width="6" stroke-linecap="round"/><rect x="330" y="110" width="210" height="180" rx="10" fill="%231A1728" stroke="%238B5CF6" stroke-width="1.5"/><rect x="350" y="135" width="170" height="60" rx="4" fill="%23261E3D"/><text x="365" y="170" fill="%23A855F7" font-family="sans-serif" font-weight="700" font-size="16">MRR +240%</text><line x1="350" y1="220" x2="480" y2="220" stroke="%2364748B" stroke-width="2"/><line x1="350" y1="240" x2="440" y2="240" stroke="%2364748B" stroke-width="2"/><text x="300" y="45" fill="%23FCD34D" font-family="sans-serif" font-weight="600" font-size="13" text-anchor="middle">FOUNDER FUEL // MORNING SESSION</text></svg>',
  },
  {
    id: 'launch-milestone',
    label: 'Launch Milestone',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="rocket" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%238B5CF6"/><stop offset="100%" stop-color="%230D0B18"/></linearGradient></defs><rect width="600" height="400" fill="url(%23rocket)"/><circle cx="300" cy="180" r="110" fill="%236D28D9" opacity="0.25"/><polygon points="300,80 340,210 260,210" fill="%23E2E8F0"/><polygon points="300,100 320,180 280,180" fill="%23A855F7"/><circle cx="300" cy="150" r="14" fill="%230D0B18"/><polygon points="260,200 240,240 270,230" fill="%239333EA"/><polygon points="340,200 360,240 330,230" fill="%239333EA"/><polygon points="285,210 300,280 315,210" fill="%23F59E0B"/><polygon points="292,210 300,260 308,210" fill="%23EF4444"/><text x="300" y="340" fill="%23F8FAFC" font-family="sans-serif" font-weight="700" font-size="20" text-anchor="middle">V1.0 SHIPPED TO PRODUCTION</text><text x="300" y="370" fill="%23C084FC" font-family="sans-serif" font-size="13" text-anchor="middle">10,000+ EARLY CREATORS ONBOARDED</text></svg>',
  },
  {
    id: 'ai-matrix',
    label: 'AI Neural Mesh',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="mesh" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%232E1065"/><stop offset="50%" stop-color="%230D0B18"/><stop offset="100%" stop-color="%234C1D95"/></linearGradient></defs><rect width="600" height="400" fill="url(%23mesh)"/><g stroke="%23A855F7" stroke-width="1" opacity="0.4"><line x1="100" y1="100" x2="250" y2="150"/><line x1="250" y1="150" x2="350" y2="120"/><line x1="350" y1="120" x2="500" y2="180"/><line x1="100" y1="100" x2="200" y2="280"/><line x1="200" y1="280" x2="320" y2="260"/><line x1="320" y1="260" x2="480" y2="300"/><line x1="250" y1="150" x2="320" y2="260"/><line x1="350" y1="120" x2="320" y2="260"/></g><circle cx="100" cy="100" r="7" fill="%23C084FC"/><circle cx="250" cy="150" r="9" fill="%23EC4899"/><circle cx="350" cy="120" r="11" fill="%23A855F7"/><circle cx="500" cy="180" r="7" fill="%23818CF8"/><circle cx="200" cy="280" r="8" fill="%23818CF8"/><circle cx="320" cy="260" r="12" fill="%23F43F5E"/><circle cx="480" cy="300" r="8" fill="%23C084FC"/><text x="300" y="50" fill="%23E2E8F0" font-family="sans-serif" font-weight="600" font-size="14" text-anchor="middle">SYNAPSE COMPUTATION ACTIVE</text></svg>',
  },
];

// --- REALISTIC INITIAL DRAFTS ---

const INITIAL_DRAFTS: DraftRecord[] = [
  {
    id: 'draft-1',
    title: 'Monolith DB Migration in 48 Hours',
    rawIdea:
      'We just migrated our entire monolithic legacy DB to micro-services and serverless in 48 hours without zero downtime. Felt like defusing a bomb in a hurricane.',
    imageUrl: SAMPLE_PRESET_IMAGES[0].url,
    imageLabel: SAMPLE_PRESET_IMAGES[0].label,
    tone: 'founder',
    createdAt: '12 mins ago',
    variations: {
      linkedin: {
        hook: '48 hours. 12 million active rows. 0 seconds of user-facing downtime.',
        body: 'Migrating away from a 7-year-old monolithic database usually takes quarters of enterprise committee meetings.\n\nOver the weekend, our 3-person core infrastructure squad executed the cutover in a 48-hour sprint.\n\nHere is the real breakdown of what kept us alive:',
        bulletPoints: [
          'Dual-write shadow synchronization: Every single mutate operation was mirrored to both old Postgres and new serverless shards.',
          'Zero-risk rollback switches: Feature flags configured at the edge layer meant we could revert within 140ms if error budgets crept over 0.01%.',
          'Ruthless telemetry hygiene: We turned off all non-essential logging to keep CPU headroom clear during the peak synchronization surge.',
        ],
        callToAction:
          'Big enterprise tech debt is not an excuse to freeze speed. Have you ever attempted an in-flight live migration without a scheduled maintenance window?',
        hashtags: ['#SoftwareEngineering', '#SystemDesign', '#CloudArchitecture', '#DevOps', '#TechLeadership'],
        estimatedReadTime: '2 min read',
      },
      twitter: {
        tweets: [
          'We just migrated a 7-year monolithic database to serverless in 48 hours.\n\n0 seconds of downtime. 12M rows moved.\n\nFelt like defusing a bomb in a Category 5 hurricane. Here is the exact playbook we used 🧵👇',
          '1/ The biggest trap in database migrations is "The Big Bang Cutover".\n\nNever do it.\n\nInstead, we set up dual-write shadow pipelines. Every incoming transaction wrote to the old database AND secretly replicated into the new shard.',
          '2/ Replay & reconcile.\n\nBefore flipping read traffic, we ran an automated differential scanner that checksummed 100,000-row chunks.\n\nFound 4 drifted rows due to race conditions. Patched them before a single customer noticed.',
          '3/ The killswitch is your psychological safety blanket.\n\nIf error rates breached 0.05%, our Cloudflare edge rules would snap back to legacy within 200ms.\n\nKnowing you can abort without disaster is what gives engineers the courage to move fast.',
          '4/ TL;DR:\n• Avoid monolithic big bangs\n• Dual-write for 72 hours first\n• Real-time checksum comparisons\n• Edge-level instant rollback\n\nBookmark this for your next architecture refactor. Repost to save an engineer an all-nighter.',
        ],
        hashtags: ['#buildinpublic', '#techthreads', '#database'],
      },
      instagram: {
        hook: 'How we migrated 12,000,000 rows of data without crashing our app for even 1 second. ⚡️💾',
        caption:
          'They told us moving away from our legacy monolith would take 6 months and a dedicated consulting firm.\n\nOur 3-person engineering team did it this weekend in 48 hours.\n\nSwipe left to see our setup at 3:42 AM when the final cutover script returned 100% green. ☕️\n\nThe lesson? Small, focused teams with clean observability move 10x faster than 50-person committees.\n\nDrop a comment: What is the most terrifying deploy you have ever shipped on a Friday night? 👇',
        hashtags: [
          '#coderlife',
          '#softwareengineer',
          '#buildinpublic',
          '#startupgrind',
          '#techcreator',
          '#devcommunity',
          '#programmerhumor',
          '#sysadmin',
        ],
        firstCommentTip: 'Pro-tip: Always test your shadow replication script on a staged replica with simulated 3x load.',
      },
    },
    genZRoast: {
      comment:
        'Bro casually dropped "defusing a bomb in a hurricane" like you were in Mission Impossible when you were just pressing Enter on a shell script in cozy sweatpants 💀 Lowkey valid flex though.',
      badge: 'Certified High-Rizz Deploy 🔥',
      vibeScore: 94,
    },
    insights: {
      bestTime: '08:15 AM - 10:00 AM EST',
      bestDays: 'Tuesday & Thursday',
      expectedBoost: '+185% Algorithmic Reach',
    },
  },
  {
    id: 'draft-2',
    title: 'Remote Work vs 8 Zoom Calls',
    rawIdea:
      'Remote work is not killing company culture. 8 back-to-back status update Zoom calls are killing company culture. Let people write async docs.',
    imageUrl: SAMPLE_PRESET_IMAGES[1].url,
    imageLabel: SAMPLE_PRESET_IMAGES[1].label,
    tone: 'viral',
    createdAt: '2 hours ago',
    variations: {
      linkedin: {
        hook: 'Unpopular opinion: Remote work never broke team culture. Your 8 daily status meetings did.',
        body: 'When leaders say "We miss the organic energy of the office," what they often mean is:\n\n"We do not know how to verify progress without trapping 7 people in a 45-minute video call where 5 of them are muted and scrolling Slack."\n\nCulture is not forced eye-contact on a grid of webcams.\n\nReal culture is built on three simple pillars:',
        bulletPoints: [
          'Deep work autonomy: Trusting senior minds to solve difficult problems in uninterrupted 3-hour blocks.',
          'High-clarity written specs: A well-structured 1-page Notion doc beats a disjointed 60-minute verbal brainstorm every single time.',
          'Async accountability: Reviewing outputs and pull requests, not green online status dots.',
        ],
        callToAction:
          'If you replaced just 50% of your weekly recurring meetings with concise written summaries, what would your team actually build?',
        hashtags: ['#FutureOfWork', '#RemoteWork', '#Leadership', '#Management', '#Productivity'],
        estimatedReadTime: '2 min read',
      },
      twitter: {
        tweets: [
          'Remote work is not killing company culture.\n\nSitting through 8 consecutive "quick sync" Zoom calls where 1 person talks and 7 pretend to listen is killing company culture.\n\nHere is how top remote teams actually run async 🧵👇',
          '1/ The "30-Minute Meeting Tax":\n\nA 30-minute sync with 6 people is not a 30-minute meeting.\n\nIt is 3 hours of accumulated human focus ripped from creative flow state. Context switching costs another 23 minutes after.',
          '2/ Replace status syncs with the 5-bullet Friday recap:\n\n• What shipped\n• What blocked us\n• Next week goal\n• Customer quote / data point\n• Where we need help\n\nTakes 4 minutes to read. Saves 40 engineering hours a month.',
          '3/ If an idea cannot be outlined in a 400-word written memo, it is not ready for a meeting.\n\nWriting forces rigorous logic. Talking allows vagueness to masquerade as momentum.',
          '4/ Give your builders their afternoons back.\n\nRetweet this if you want fewer calendar invites and more quiet shipping time this week.',
        ],
        hashtags: ['#remotework', '#productivity', '#techculture'],
      },
      instagram: {
        hook: 'The truth about why everyone is exhausted by 3 PM... and it is not the workload. 📉🥱',
        caption:
          'Friendly reminder: You do not hate your job. You hate having your focus shattered into 25-minute fragments by meetings that could have been a 3-sentence message.\n\nReal productivity happens in the quiet hours.\n\nSave this post to remind yourself to protect your calendar tomorrow. 🗓️✨\n\nHow many meetings did you have today? Be honest in the comments. 💬',
        hashtags: [
          '#worklifebalance',
          '#burnoutprevention',
          '#workfromanywhere',
          '#digitalnomad',
          '#corporatememes',
          '#founderlife',
          '#careertips',
        ],
        firstCommentTip: 'Tip: Block out Tuesday and Thursday mornings as "No-Meeting Focus Zones" in your Google Calendar.',
      },
    },
    genZRoast: {
      comment:
        'You are speaking pure truth, but we all know you still nodded along in 4 useless Zoom calls today while secretly online shopping. No cap though, async is king.',
      badge: 'Main Character Energy 💅',
      vibeScore: 98,
    },
    insights: {
      bestTime: '11:30 AM - 01:00 PM EST',
      bestDays: 'Monday & Wednesday',
      expectedBoost: '+230% Viral Reshare Ratio',
    },
  },
];

// --- GENERATION ALGORITHM ---

function generatePostVariations(
  rawIdea: string,
  tone: ToneType,
  hasImage: boolean
): {
  variations: PostVariations;
  genZRoast: { comment: string; badge: string; vibeScore: number };
  insights: { bestTime: string; bestDays: string; expectedBoost: string };
} {
  const cleanIdea = rawIdea.trim() || 'Building an exceptional product in public';
  const wordCount = cleanIdea.split(/\s+/).length;

  // Witty slang dictionary & tone modifiers
  const genZComments = [
    {
      comment: `Bro cooked a five-star meal with this thought. The algorithm is literally about to eat this up with zero crumbs left. 🍳✨`,
      badge: 'Certified Cooked Fr 🔥',
      vibeScore: 96,
    },
    {
      comment: `You’re speaking fluent Silicon Valley dialect with heavy main character energy. Post it before someone steals your thunder! ⚡️`,
      badge: 'Pure Dopamine Spill 🚀',
      vibeScore: 91,
    },
    {
      comment: `Lowkey a hot take that will start at least three heated comment wars in the LinkedIn comments. Grab your popcorn. 🍿💀`,
      badge: 'High-Spicy Ratio 🌶️',
      vibeScore: 95,
    },
    {
      comment: `No cap, this is the exact kind of insight founders bookmark at 2 AM and pretend they came up with in their own pitch deck. 📝`,
      badge: 'Bookmarked for Life 📌',
      vibeScore: 89,
    },
  ];

  const selectedRoast = genZComments[Math.floor(Math.random() * genZComments.length)];

  // Tone adaptations
  let hookPrefix = '';
  let closingStatement = '';
  if (tone === 'thought_leader') {
    hookPrefix = 'Most leaders are looking at this completely backwards:';
    closingStatement = 'Real leadership isn’t about having all the answers; it’s about framing the right questions.';
  } else if (tone === 'founder') {
    hookPrefix = 'Here is the unglamorous truth no one tells you on day 1:';
    closingStatement = 'Shipping imperfect things fast will always beat perfecting things that never see daylight.';
  } else if (tone === 'genz') {
    hookPrefix = 'I cannot believe people are still doing this in 2026:';
    closingStatement = 'Stop doing busywork to feel productive. Work smarter or get cooked.';
  } else if (tone === 'educational') {
    hookPrefix = 'A step-by-step breakdown that took me 3 years to figure out:';
    closingStatement = 'Save this framework to your system so you don’t repeat our mistakes.';
  } else {
    hookPrefix = 'The single most contrarian lesson we learned this month:';
    closingStatement = 'Drop a comment with your take—I want to see if anyone disagrees.';
  }

  // LinkedIn
  const linkedin = {
    hook: `${hookPrefix}\n\n"${cleanIdea}"`,
    body: `When we first encountered this problem, we assumed the conventional playbook would work.\n\nIt didn’t.\n\nIn fact, doing things the "standard way" cost us weeks of momentum. Here are the 3 tactical shifts that changed everything:`,
    bulletPoints: [
      `Strip away the secondary noise: We focused on 1 core metric rather than tracking 14 vanity dashboards.`,
      `Radical transparency with the squad: If a feature is struggling, say it out loud on day 2, not during post-mortem week.`,
      `Short feedback loops: Getting 5 honest user reactions today beats 50 hypothetical survey answers next month.`,
    ],
    callToAction: `${closingStatement}\n\nHow does your team navigate this when the pressure is on?`,
    hashtags: ['#Innovation', '#Leadership', '#GrowthMindset', '#CreatorEconomy', '#TechTrends'],
    estimatedReadTime: `${Math.max(1, Math.round(wordCount / 60) + 1)} min read`,
  };

  // Twitter/X
  const twitter = {
    tweets: [
      `1/ "${cleanIdea}"\n\nMost people miss the real reason why this matters so much right now.\n\nA short, actionable breakdown on how to leverage this 🧵👇`,
      `2/ First, stop relying on outdated assumptions.\n\nThe old paradigm was designed for slower cycles. Today, speed of iteration is the only real moat.\n\nIf your feedback loop is slower than 48 hours, you’re flying blind.`,
      `3/ The 80/20 rule applied to this:\n\n• Identify the 1 action that creates 80% of downstream leverage\n• Eliminate the 4 ceremonial steps that exist just for bureaucracy\n• Automate or delegate the repetitive maintenance`,
      `4/ The result?\n\nLess mental exhaustion, zero stalled projects, and compounding momentum every single sprint.`,
      `5/ TL;DR on "${cleanIdea.slice(0, 50)}...":\n\n• Action over contemplation\n• High clarity, zero fluff\n• Iterate in public\n\nIf this was valuable, bookmark it and share the first tweet with a friend.`,
    ],
    hashtags: ['#buildinpublic', '#tech', '#insights'],
  };

  // Instagram
  const instagram = {
    hook: `Read this twice: "${cleanIdea.slice(0, 80)}${cleanIdea.length > 80 ? '...' : ''}" ✨`,
    caption: `${cleanIdea}\n\nIt’s so easy to get caught up in the daily grind that we forget why we started building in the first place.\n\n${closingStatement}\n\nSwipe through the carousel to see the behind-the-scenes reality. 📸\n\nDrop a ❤️ if this resonated with where you are at today, and save it for whenever you need a quick perspective reset. 📌`,
    hashtags: [
      '#creativemindset',
      '#growthjourney',
      '#entrepreneurlife',
      '#behindthescenes',
      '#dailyinspiration',
      '#contentcreator',
      '#mindsetshift',
    ],
    firstCommentTip: 'Bookmark this post and tag a teammate who needs to hear this today! 👇',
  };

  return {
    variations: { linkedin, twitter, instagram },
    genZRoast: selectedRoast,
    insights: {
      bestTime: tone === 'founder' ? '07:45 AM EST' : '11:15 AM EST',
      bestDays: 'Tuesday, Wednesday & Thursday',
      expectedBoost: '+210% Organic Reach Rate',
    },
  };
}

export default function App() {
  // State management
  const [drafts, setDrafts] = useState<DraftRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vibepost_drafts');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_DRAFTS;
  });

  const [activeDraftId, setActiveDraftId] = useState<string>(INITIAL_DRAFTS[0].id);
  const [rawIdea, setRawIdea] = useState<string>(INITIAL_DRAFTS[0].rawIdea);
  const [selectedTone, setSelectedTone] = useState<ToneType>('founder');
  const [attachedImage, setAttachedImage] = useState<string | null>(INITIAL_DRAFTS[0].imageUrl);
  const [attachedLabel, setAttachedLabel] = useState<string | null>(INITIAL_DRAFTS[0].imageLabel);

  const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Editing state for generated posts
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>('');

  // UI status states
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [creatorName, setCreatorName] = useState<string>('Alex Vance');
  const [creatorHandle, setCreatorHandle] = useState<string>('@alexbuilds');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Sync state with active draft
  const currentDraft = drafts.find((d) => d.id === activeDraftId) || drafts[0];

  // Persist drafts
  useEffect(() => {
    try {
      localStorage.setItem('vibepost_drafts', JSON.stringify(drafts));
    } catch {
      // Ignore quota errors
    }
  }, [drafts]);

  // When active draft changes, sync raw input and reset edit mode
  const handleSelectDraft = (draft: DraftRecord) => {
    setActiveDraftId(draft.id);
    setRawIdea(draft.rawIdea);
    setSelectedTone(draft.tone);
    setAttachedImage(draft.imageUrl);
    setAttachedLabel(draft.imageLabel);
    setIsEditing(false);
  };

  // Generate new content
  const handleGenerate = () => {
    if (!rawIdea.trim()) return;

    setIsGenerating(true);
    setGenerationStep('Analyzing core idea & hook dynamics...');

    setTimeout(() => {
      setGenerationStep('Formatting LinkedIn high-engagement structure...');
    }, 450);

    setTimeout(() => {
      setGenerationStep('Synthesizing Twitter/X narrative thread...');
    }, 900);

    setTimeout(() => {
      setGenerationStep('Polishing Instagram copy & Gen-Z buddy roast...');
    }, 1350);

    setTimeout(() => {
      const generated = generatePostVariations(rawIdea, selectedTone, Boolean(attachedImage));
      const newDraftId = `draft-${Date.now()}`;
      const newTitle = rawIdea.trim().slice(0, 36) + (rawIdea.length > 36 ? '...' : '');

      const newRecord: DraftRecord = {
        id: newDraftId,
        title: newTitle,
        rawIdea: rawIdea.trim(),
        imageUrl: attachedImage,
        imageLabel: attachedLabel,
        tone: selectedTone,
        createdAt: 'Just now',
        variations: generated.variations,
        genZRoast: generated.genZRoast,
        insights: generated.insights,
      };

      setDrafts((prev) => [newRecord, ...prev.filter((d) => d.id !== newDraftId)]);
      setActiveDraftId(newDraftId);
      setIsGenerating(false);
      setIsEditing(false);
    }, 1800);
  };

  // Start new empty draft
  const handleNewDraft = () => {
    setRawIdea('');
    setAttachedImage(null);
    setAttachedLabel(null);
    setSelectedTone('viral');
    setIsEditing(false);
  };

  // Delete draft
  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = drafts.filter((d) => d.id !== id);
    if (remaining.length > 0) {
      setDrafts(remaining);
      if (activeDraftId === id) {
        handleSelectDraft(remaining[0]);
      }
    }
  };

  // Get current active post text for copying, sharing, editing
  const getActivePostString = (): string => {
    if (!currentDraft) return '';
    const { variations } = currentDraft;

    if (activePlatform === 'linkedin') {
      const p = variations.linkedin;
      return `${p.hook}\n\n${p.body}\n\n${p.bulletPoints.map((b) => `• ${b}`).join('\n')}\n\n${p.callToAction}\n\n${p.hashtags.join(' ')}`;
    } else if (activePlatform === 'twitter') {
      return variations.twitter.tweets.join('\n\n---\n\n') + '\n\n' + variations.twitter.hashtags.join(' ');
    } else {
      const ig = variations.instagram;
      return `${ig.hook}\n\n${ig.caption}\n\n${ig.hashtags.join(' ')}\n\n💡 Comment Tip: ${ig.firstCommentTip}`;
    }
  };

  // Quick copy handler
  const handleCopy = (text?: string) => {
    const textToCopy = text || (isEditing ? editedText : getActivePostString());
    navigator.clipboard.writeText(textToCopy);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    const text = isEditing ? editedText : getActivePostString();
    const encoded = encodeURIComponent(`*Shared via VibePost AI:*\n\n${text}`);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // PDF Export via window.print()
  const handleExportPDF = () => {
    window.print();
  };

  // Download raw text as .txt file
  const handleDownloadText = () => {
    const content = `======================================================
VIBEPOST AI - GENERATED CONTENT
Platform: ${activePlatform.toUpperCase()}
Tone: ${selectedTone.toUpperCase()}
Created: ${currentDraft.createdAt}
======================================================

RAW IDEA:
${currentDraft.rawIdea}

------------------------------------------------------
CONTENT:
------------------------------------------------------
${isEditing ? editedText : getActivePostString()}

------------------------------------------------------
GEN-Z BUDDY COMMENTARY:
${currentDraft.genZRoast.comment} (Rating: ${currentDraft.genZRoast.badge})
------------------------------------------------------
OPTIMAL POSTING TIME: ${currentDraft.insights.bestTime} on ${currentDraft.insights.bestDays}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibepost-${activePlatform}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Regenerate just the active platform variation
  const handleRegeneratePlatform = () => {
    setIsGenerating(true);
    setGenerationStep(`Refreshing ${activePlatform} variation with alternate hooks...`);
    setTimeout(() => {
      const generated = generatePostVariations(currentDraft.rawIdea, selectedTone, Boolean(attachedImage));
      setDrafts((prev) =>
        prev.map((d) => {
          if (d.id === currentDraft.id) {
            return {
              ...d,
              variations: {
                ...d.variations,
                [activePlatform]: generated.variations[activePlatform],
              },
              genZRoast: generated.genZRoast,
            };
          }
          return d;
        })
      );
      setIsGenerating(false);
      setIsEditing(false);
    }, 850);
  };

  // Toggle inline editing
  const handleStartEdit = () => {
    setEditedText(getActivePostString());
    setIsEditing(true);
  };

  // Save manual edits
  const handleSaveEdit = () => {
    if (!editedText.trim()) return;

    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id === currentDraft.id) {
          if (activePlatform === 'linkedin') {
            return {
              ...d,
              variations: {
                ...d.variations,
                linkedin: {
                  ...d.variations.linkedin,
                  body: editedText,
                  hook: editedText.split('\n')[0] || d.variations.linkedin.hook,
                  bulletPoints: [],
                  callToAction: '',
                },
              },
            };
          } else if (activePlatform === 'twitter') {
            const tweets = editedText.split(/\n\n---\n\n|\n\n\n/).filter(Boolean);
            return {
              ...d,
              variations: {
                ...d.variations,
                twitter: {
                  ...d.variations.twitter,
                  tweets: tweets.length > 0 ? tweets : [editedText],
                },
              },
            };
          } else {
            return {
              ...d,
              variations: {
                ...d.variations,
                instagram: {
                  ...d.variations.instagram,
                  caption: editedText,
                },
              },
            };
          }
        }
        return d;
      })
    );
    setIsEditing(false);
  };

  // Custom image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAttachedImage(result);
        setAttachedLabel(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0B18] text-slate-100 flex flex-col font-sans relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background ambient purple neon glow fields */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-[20%] w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-[10%] left-[10%] w-[600px] h-[600px] bg-indigo-700/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Header Bar */}
      <header className="no-print relative z-20 h-16 border-b border-white/[0.08] backdrop-blur-md bg-[#0D0B18]/70 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 p-0.5 shadow-lg shadow-purple-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0D0B18] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
                VibePost AI
              </span>
            </div>
          </div>
        </div>

        {/* Center Breadcrumb indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span>Studio</span>
          <span className="text-slate-600">/</span>
          <span className="text-purple-300 truncate max-w-xs">{currentDraft.title}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500 capitalize">{selectedTone} Mode</span>
        </div>

        {/* Right Header Utility Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileInsightsOpen(!mobileInsightsOpen)}
            className="xl:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Insights</span>
          </button>

          <button
            onClick={handleNewDraft}
            className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">New Draft</span>
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 transition-colors"
            title="Settings & Persona"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main 3-Column Studio Workspace */}
      <div className="no-print relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT SIDEBAR: Navigation & Draft History */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 backdrop-blur-xl bg-[#0D0B18]/95 border-r border-white/[0.08] p-4 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Mobile close button */}
          <div className="md:hidden flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <span className="text-sm font-semibold text-slate-300">Navigation</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-1 mb-6">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.06] text-purple-300 border border-purple-500/20 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Studio Generator</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.04] text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
            >
              <Sliders className="w-4 h-4" />
              <span>Tone & Persona</span>
            </button>
          </div>

          {/* Drafts Section Header */}
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Recent Drafts</span>
            </div>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
              {drafts.length}
            </span>
          </div>

          {/* Draft List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {drafts.map((d) => {
              const isActive = d.id === activeDraftId;
              return (
                <div
                  key={d.id}
                  onClick={() => {
                    handleSelectDraft(d);
                    setMobileMenuOpen(false);
                  }}
                  className={`group relative p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-900/20 border-purple-500/40 shadow-lg shadow-purple-950/40'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4
                      className={`text-xs font-medium line-clamp-1 ${
                        isActive ? 'text-purple-200' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {d.title}
                    </h4>
                    {drafts.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteDraft(d.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete draft"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">{d.rawIdea}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="capitalize text-purple-400/80">{d.tone}</span>
                    <span>{d.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Profile Mini Bar */}
          <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {creatorName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200 leading-tight">{creatorName}</span>
                <span className="text-[10px] text-slate-400 leading-tight font-mono">{creatorHandle}</span>
              </div>
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-slate-400 hover:text-purple-300 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
          />
        )}

        {/* CENTER MAIN PANEL: Dual Input & Generated Variations */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
          {/* Top Card: Dual Raw Input & Media Preview */}
          <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
            {/* Subtle glow border highlight */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Raw Idea / Brain Dump
                </span>
                <span className="text-[11px] text-slate-400">· Express your unpolished thoughts</span>
              </div>

              {/* Character counter */}
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {rawIdea.length} characters · {rawIdea.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Main Textarea */}
            <div className="relative">
              <textarea
                value={rawIdea}
                onChange={(e) => setRawIdea(e.target.value)}
                placeholder="Type your raw concept, contrarian belief, recent milestone, or client lesson here... (e.g., We rewrote our core algorithm and cut cloud spend by 70% in 3 days)"
                rows={3}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Media Attachment Bar & Presets */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                  Media:
                </span>

                {/* Sample Photo Preset Selectors */}
                {SAMPLE_PRESET_IMAGES.map((img) => {
                  const isSelected = attachedImage === img.url;
                  return (
                    <button
                      key={img.id}
                      onClick={() => {
                        if (isSelected) {
                          setAttachedImage(null);
                          setAttachedLabel(null);
                        } else {
                          setAttachedImage(img.url);
                          setAttachedLabel(img.label);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                          : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-white/[0.06]'
                      }`}
                    >
                      <span>{img.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                    </button>
                  );
                })}

                {/* Custom File Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08] border border-dashed border-white/20 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Upload custom</span>
                </button>
              </div>

              {/* Attached Image Preview Pill */}
              {attachedImage && (
                <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 rounded-lg px-2.5 py-1">
                  <img
                    src={attachedImage}
                    alt={attachedLabel || 'Attached thumbnail'}
                    className="w-5 h-5 rounded object-cover border border-purple-500/30"
                  />
                  <span className="text-[11px] text-purple-200 truncate max-w-[120px]">
                    {attachedLabel || 'Attached'}
                  </span>
                  <button
                    onClick={() => {
                      setAttachedImage(null);
                      setAttachedLabel(null);
                    }}
                    className="text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Tone Selector & Action Button */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Tone Selection */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-slate-400 mr-1 whitespace-nowrap">Vibe:</span>
                {(
                  [
                    { id: 'viral', label: 'Viral ⚡️' },
                    { id: 'thought_leader', label: 'Thought Leader 👔' },
                    { id: 'founder', label: 'Founder Story 🚀' },
                    { id: 'genz', label: 'Gen-Z Raw 💀' },
                    { id: 'educational', label: 'Deep Dive 💡' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTone(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      selectedTone === t.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-white/[0.07]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Generate Button with Purple Glow */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !rawIdea.trim()}
                className="relative group px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white text-xs md:text-sm font-semibold shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shrink-0"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Synthesizing Variations...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
                    <span>Generate Posts</span>
                  </>
                )}
              </button>
            </div>

            {/* In-Flight Multi-Step Generation Banner */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-3 border-t border-purple-500/20"
                >
                  <div className="flex items-center gap-2 text-xs text-purple-300 font-mono">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>{generationStep}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Card: Platform Tabbed Variations */}
          <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden">
            {/* Platform Selector Tabs */}
            <div className="border-b border-white/[0.08] px-4 md:px-6 flex items-center justify-between flex-wrap gap-2 bg-black/20">
              <div className="flex items-center gap-1 -mb-px">
                <button
                  onClick={() => {
                    setActivePlatform('linkedin');
                    setIsEditing(false);
                  }}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
                    activePlatform === 'linkedin'
                      ? 'border-purple-500 text-purple-300 bg-purple-500/[0.06]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span>LinkedIn Post</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400">Long-form</span>
                </button>

                <button
                  onClick={() => {
                    setActivePlatform('twitter');
                    setIsEditing(false);
                  }}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
                    activePlatform === 'twitter'
                      ? 'border-purple-500 text-purple-300 bg-purple-500/[0.06]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                  <span>Twitter / X Thread</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400">5-Part</span>
                </button>

                <button
                  onClick={() => {
                    setActivePlatform('instagram');
                    setIsEditing(false);
                  }}
                  className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
                    activePlatform === 'instagram'
                      ? 'border-purple-500 text-purple-300 bg-purple-500/[0.06]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Instagram className="w-4 h-4 text-[#E4405F]" />
                  <span>Instagram Caption</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400">Visual</span>
                </button>
              </div>

              {/* Action Toolbar on Top of Tab */}
              <div className="flex items-center gap-1.5 py-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 border border-white/10 transition-colors"
                    title="Edit text manually"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Edit Post</span>
                  </button>
                )}

                <button
                  onClick={handleRegeneratePlatform}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 border border-white/10 transition-colors"
                  title="Regenerate this platform variation"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Regenerate</span>
                </button>

                <button
                  onClick={() => handleCopy()}
                  className="px-3 py-1 rounded-md bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 text-xs font-medium flex items-center gap-1.5 border border-purple-500/30 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedToast ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Quick Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Post Content Area */}
            <div className="p-5 md:p-6">
              {isEditing ? (
                /* LIVE INLINE EDITING TEXTAREA */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Live editing {activePlatform} content:</span>
                    <span className="font-mono">{editedText.length} characters</span>
                  </div>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={14}
                    className="w-full bg-black/40 border border-purple-500/40 rounded-xl p-4 text-sm text-slate-100 font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 shadow-md shadow-purple-600/30"
                    >
                      Save & Apply
                    </button>
                  </div>
                </div>
              ) : (
                /* VIEW MODES PER PLATFORM */
                <div>
                  {/* LINKEDIN FORMAT */}
                  {activePlatform === 'linkedin' && (
                    <div className="space-y-5">
                      {/* Creator badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow">
                            {creatorName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-200">{creatorName}</span>
                              <span className="text-[10px] text-slate-500">· 1st</span>
                            </div>
                            <span className="text-[11px] text-slate-400">Founder & Engineer · Building with AI</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {currentDraft.variations.linkedin.estimatedReadTime}
                        </span>
                      </div>

                      {/* Hook & Body */}
                      <div className="space-y-4 text-sm leading-relaxed text-slate-200 font-sans">
                        <p className="font-semibold text-white text-base">
                          {currentDraft.variations.linkedin.hook}
                        </p>

                        <div className="whitespace-pre-line text-slate-300">
                          {currentDraft.variations.linkedin.body}
                        </div>

                        {/* Bullet points */}
                        {currentDraft.variations.linkedin.bulletPoints?.length > 0 && (
                          <div className="space-y-2 bg-white/[0.02] border-l-2 border-purple-500 pl-4 py-2 my-3 rounded-r-lg">
                            {currentDraft.variations.linkedin.bulletPoints.map((b, i) => (
                              <p key={i} className="text-slate-300 text-xs md:text-sm">
                                • {b}
                              </p>
                            ))}
                          </div>
                        )}

                        {currentDraft.variations.linkedin.callToAction && (
                          <p className="font-medium text-purple-300 pt-2 border-t border-white/[0.06]">
                            {currentDraft.variations.linkedin.callToAction}
                          </p>
                        )}
                      </div>

                      {/* Attached Image inside feed simulation */}
                      {currentDraft.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-white/10 max-h-72 bg-black/40">
                          <img
                            src={currentDraft.imageUrl}
                            alt="LinkedIn Attachment"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {currentDraft.variations.linkedin.hashtags.map((h, i) => (
                          <span
                            key={i}
                            className="text-xs font-mono text-purple-400/90 hover:text-purple-300 cursor-pointer"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TWITTER / X THREAD FORMAT */}
                  {activePlatform === 'twitter' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/[0.06]">
                        <span>Full 5-Tweet Thread Preview</span>
                        <span className="font-mono text-purple-400">
                          {currentDraft.variations.twitter.tweets.length} Tweets in sequence
                        </span>
                      </div>

                      <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-purple-500/20">
                        {currentDraft.variations.twitter.tweets.map((tw, idx) => (
                          <div
                            key={idx}
                            className="relative pl-11 group p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-colors"
                          >
                            {/* Tweet index dot */}
                            <div className="absolute left-2.5 top-4 w-5 h-5 rounded-full bg-purple-950 border border-purple-500 text-[10px] font-mono text-purple-300 flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-200">{creatorName}</span>
                                <span className="text-[11px] text-slate-400 font-mono">{creatorHandle}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                                {tw.length} / 280
                              </span>
                            </div>

                            {/* Tweet Text */}
                            <p className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                              {tw}
                            </p>

                            {/* Single image attached to first tweet */}
                            {idx === 0 && currentDraft.imageUrl && (
                              <div className="mt-3 rounded-lg overflow-hidden border border-white/10 max-h-48 bg-black/40">
                                <img
                                  src={currentDraft.imageUrl}
                                  alt="Tweet media"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {/* Tweet quick copy */}
                            <div className="mt-2.5 flex justify-end">
                              <button
                                onClick={() => handleCopy(tw)}
                                className="text-[10px] text-slate-400 hover:text-purple-300 flex items-center gap-1 font-mono transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Tweet</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {currentDraft.variations.twitter.hashtags.map((h, i) => (
                          <span key={i} className="text-xs font-mono text-purple-400/90">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* INSTAGRAM CAPTION FORMAT */}
                  {activePlatform === 'instagram' && (
                    <div className="space-y-4">
                      {/* Instagram Visual Post Preview Card */}
                      <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                        {/* IG Header */}
                        <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-fuchsia-500 p-0.5">
                              <div className="w-full h-full bg-[#0D0B18] rounded-full flex items-center justify-center text-[10px] font-bold">
                                {creatorName.charAt(0)}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-200">{creatorHandle.replace('@', '')}</span>
                          </div>
                          <span className="text-slate-400 text-xs">···</span>
                        </div>

                        {/* Image Canvas / Visual */}
                        <div className="aspect-[4/3] bg-neutral-900 flex items-center justify-center relative overflow-hidden">
                          {currentDraft.imageUrl ? (
                            <img
                              src={currentDraft.imageUrl}
                              alt="Instagram post visual"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="p-6 text-center">
                              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-60" />
                              <p className="text-xs text-slate-400">Pick a sample photo or upload to see feed preview</p>
                            </div>
                          )}
                        </div>

                        {/* Caption Preview */}
                        <div className="p-4 space-y-3">
                          <p className="text-xs font-bold text-purple-300">
                            {currentDraft.variations.instagram.hook}
                          </p>
                          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                            {currentDraft.variations.instagram.caption}
                          </p>

                          {/* Hashtag Cloud */}
                          <div className="pt-2 border-t border-white/[0.06] flex flex-wrap gap-1">
                            {currentDraft.variations.instagram.hashtags.map((h, i) => (
                              <span key={i} className="text-[11px] font-mono text-purple-400">
                                {h}
                              </span>
                            ))}
                          </div>

                          {/* First Comment Strategy Tip */}
                          {currentDraft.variations.instagram.firstCommentTip && (
                            <div className="bg-purple-950/30 border border-purple-500/20 rounded-lg p-2.5 mt-2">
                              <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider block mb-0.5">
                                First Comment Engagement Hack:
                              </span>
                              <span className="text-xs text-slate-300">
                                {currentDraft.variations.instagram.firstCommentTip}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: Utility & Insights */}
        <aside
          className={`fixed inset-y-0 right-0 z-30 w-80 backdrop-blur-xl bg-[#0D0B18]/95 border-l border-white/[0.08] p-5 space-y-5 transition-transform duration-300 xl:static xl:translate-x-0 ${
            mobileInsightsOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
          }`}
        >
          {/* Mobile close button */}
          <div className="xl:hidden flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-sm font-semibold text-slate-300">Companion & Utility</span>
            <button
              onClick={() => setMobileInsightsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1. Gen-Z Buddy Card */}
          <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-fuchsia-500 flex items-center justify-center shadow">
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-200 tracking-tight">Gen-Z Buddy AI</span>
              </div>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {currentDraft.genZRoast.badge}
              </span>
            </div>

            {/* Buddy Speech Bubble */}
            <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3 relative text-xs text-slate-200 leading-relaxed font-sans mb-3">
              <p className="italic">"{currentDraft.genZRoast.comment}"</p>
            </div>

            {/* Vibe Score Bar */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Viral Rizz Index</span>
                <span className="font-mono text-purple-400 font-semibold">
                  {currentDraft.genZRoast.vibeScore} / 100
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${currentDraft.genZRoast.vibeScore}%` }}
                />
              </div>
            </div>

            {/* Refresh Roast Button */}
            <button
              onClick={() => {
                const refreshed = generatePostVariations(currentDraft.rawIdea, selectedTone, Boolean(attachedImage));
                setDrafts((prev) =>
                  prev.map((d) => (d.id === currentDraft.id ? { ...d, genZRoast: refreshed.genZRoast } : d))
                );
              }}
              className="w-full py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-purple-400" />
              <span>Hit Me With Another Roast</span>
            </button>
          </div>

          {/* 2. Posting Insights Card */}
          <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200 tracking-tight">Algorithmic Forecast</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Peak Window
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Best Time
                </span>
                <span className="font-semibold text-slate-200 font-mono">{currentDraft.insights.bestTime}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <span className="text-slate-400">Peak Days</span>
                <span className="font-semibold text-slate-200">{currentDraft.insights.bestDays}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between">
                <span className="text-purple-300">Boost Multiplier</span>
                <span className="font-mono text-purple-300 font-bold">{currentDraft.insights.expectedBoost}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Based on rolling platform engagement heuristics for {activePlatform.toUpperCase()} B2B tech audiences.
            </p>
          </div>

          {/* 3. Export Suite Card */}
          <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-2.5">
            <span className="text-xs font-bold text-slate-200 tracking-tight block mb-2">Export & Share Suite</span>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-2 px-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Share to WhatsApp</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400/70 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* PDF Export */}
            <button
              onClick={handleExportPDF}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-purple-400" />
                <span>Export as PDF</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Print dialog</span>
            </button>

            {/* Download Text */}
            <button
              onClick={handleDownloadText}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <FileDown className="w-4 h-4 text-purple-400" />
                <span>Download Plain Text (.txt)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Instant</span>
            </button>
          </div>
        </aside>

        {/* Mobile Insights Backdrop */}
        {mobileInsightsOpen && (
          <div
            onClick={() => setMobileInsightsOpen(false)}
            className="xl:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
          />
        )}
      </div>

      {/* SETTINGS / PERSONA MODAL */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md backdrop-blur-xl bg-[#130F24] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-sm text-white">Creator Persona & Settings</h3>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Creator Name / Brand</label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Social Handle</label>
                  <input
                    type="text"
                    value={creatorHandle}
                    onChange={(e) => setCreatorHandle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Default Vibe Tone</label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value as ToneType)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="viral">Viral & Punchy</option>
                    <option value="thought_leader">Thought Leader</option>
                    <option value="founder">Founder Story</option>
                    <option value="genz">Gen-Z Raw</option>
                    <option value="educational">Deep Dive Educational</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CLEAN PRINT-ONLY VIEW FOR WINDOW.PRINT() PDF EXPORT */}
      <div className="hidden print:block print-only print-content">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-black mb-1">VibePost AI - Social Media Content Export</h1>
          <p className="text-sm text-neutral-600">
            Platform: {activePlatform.toUpperCase()} | Tone: {selectedTone.toUpperCase()} | Export Date:{' '}
            {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Original Raw Idea</h3>
          <p className="text-neutral-800 text-sm italic bg-neutral-100 p-3 rounded">{currentDraft.rawIdea}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Generated Content ({activePlatform.toUpperCase()})
          </h3>
          <div className="text-neutral-900 text-sm whitespace-pre-line leading-relaxed font-serif p-4 border border-neutral-300 rounded">
            {getActivePostString()}
          </div>
        </div>

        <div className="border-t pt-4 text-xs text-neutral-500 flex justify-between">
          <span>Target Audience Optimal Timing: {currentDraft.insights.bestTime}</span>
          <span>Generated with VibePost AI</span>
        </div>
      </div>
    </div>
  );
}

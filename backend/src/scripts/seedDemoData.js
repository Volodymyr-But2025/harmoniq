import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { connectMongoDB } from '../db/connectMongoDB.js';
import { Article } from '../models/article.js';
import { User } from '../models/user.js';

const SEED_EMAIL_RE = /@harmoniq\.seed$/;
const SEED_PASSWORD = 'SeedPass123';

const paragraph = (text) => {
  if (text.length < 100) {
    throw new Error(`Article desc too short (${text.length}): ${text.slice(0, 40)}`);
  }
  if (text.length > 4000) {
    throw new Error('Article desc too long');
  }
  return text;
};

const title = (text) => {
  if (text.length < 3 || text.length > 48) {
    throw new Error(`Bad title length ${text.length}: ${text}`);
  }
  return text;
};

const authors = [
  {
    username: 'Maya Chen',
    email: 'maya.chen@harmoniq.seed',
    name: 'Maya Chen',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_400,h_400/woman.jpg',
    articles: [
      {
        title: title('Morning breathwork for busy days'),
        date: '2026-03-12',
        rate: 18,
        img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'A ten-minute breathing practice can change the tone of a whole workday. Sit upright, inhale for four counts, hold for two, and exhale for six. Repeat until the shoulders drop. This article shares a simple sequence you can do before opening email, plus cues for when anxiety spikes at the desk.',
        ),
      },
      {
        title: title('How to keep a kind inner voice'),
        date: '2026-04-02',
        rate: 11,
        img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Self-talk often sounds like a critic with a megaphone. Naming the voice, thanking it for trying to protect you, and rewriting the line in a calmer tone is a skill. Here are prompts I use after mistakes at work and in relationships, so shame does not get the last word.',
        ),
      },
    ],
  },
  {
    username: 'Luca Rossi',
    email: 'luca.rossi@harmoniq.seed',
    name: 'Luca Rossi',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_400,h_400/man.jpg',
    articles: [
      {
        title: title('Forest walks that actually restore'),
        date: '2026-02-18',
        rate: 22,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Not every walk is rest. Leave the headphones at home, pick a loop you will not rush, and notice five textures: bark, light, soil, birds, your own pace. I explain why short daily trails beat rare heroic hikes when you want a nervous system that can settle again.',
        ),
      },
      {
        title: title('Weekend without the hurry'),
        date: '2026-05-09',
        rate: 9,
        img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Saturday can feel like another deadline if you fill it with errands and catch-up work. I plan one slow meal, one outdoor hour, and one no-screen block. The rest stays flexible. This is the template that finally made weekends feel longer instead of like a blur.',
        ),
      },
    ],
  },
  {
    username: 'Aisha Khan',
    email: 'aisha.khan@harmoniq.seed',
    name: 'Aisha Khan',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_400,h_400/sample.jpg',
    articles: [
      {
        title: title('Journaling when the mind is loud'),
        date: '2026-01-22',
        rate: 15,
        img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'You do not need a beautiful notebook or a perfect morning. Set a timer for eight minutes and write without editing. If you stall, copy the sentence “right now I feel…” until something true appears. I include three prompts for overwhelm, grief, and decision fog.',
        ),
      },
      {
        title: title('Tiny rituals after a hard talk'),
        date: '2026-06-14',
        rate: 7,
        img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Difficult conversations linger in the body. A glass of water, a short walk around the block, and a note of what you still respect in the other person can close the loop. These steps are small on purpose: they work even when you have to return to a meeting in fifteen minutes.',
        ),
      },
    ],
  },
  {
    username: 'Noah Berg',
    email: 'noah.berg@harmoniq.seed',
    name: 'Noah Berg',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_400,h_400/couple.jpg',
    articles: [
      {
        title: title('A digital sunset that sticks'),
        date: '2026-03-01',
        rate: 19,
        img: 'https://images.unsplash.com/photo-1512428559087-560fa5ce750f?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Put the phone to charge outside the bedroom one hour before sleep. Replace the scroll with paper, stretching, or a dull podcast on a speaker. The first week feels itchy. By week three most people report falling asleep faster and checking fewer notifications at midnight.',
        ),
      },
      {
        title: title('Focus without punishing yourself'),
        date: '2026-07-08',
        rate: 6,
        img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Deep work culture can become another stick to beat yourself with. I use forty-minute sprints, a visible water bottle, and a kind restart after interruptions. Missing a sprint is data, not a moral failure. Here is how I plan a day that includes rest instead of treating rest as leftover time.',
        ),
      },
    ],
  },
  {
    username: 'Sofia Alvarez',
    email: 'sofia.alvarez@harmoniq.seed',
    name: 'Sofia Alvarez',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_400,h_400/woman.jpg',
    articles: [
      {
        title: title('The evening tea that marks rest'),
        date: '2026-02-05',
        rate: 13,
        img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'A kettle can be a boundary. I brew herbal tea, sit without a screen, and let the cup cool enough to hold. That pause tells my body the workday ended. This piece covers blends that do not wreck sleep and how to keep the ritual when you live with other people.',
        ),
      },
      {
        title: title('Cooking as a nervous system tool'),
        date: '2026-05-21',
        rate: 10,
        img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Chopping vegetables is repetitive on purpose. Smell, heat, and a finished plate give the brain a complete story. You do not need chef skills: one pot, olive oil, and whatever is in the fridge. I share a week of low-decision meals that still feel like care.',
        ),
      },
    ],
  },
  {
    username: 'Kenji Mori',
    email: 'kenji.mori@harmoniq.seed',
    name: 'Kenji Mori',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_400,h_400/bike.jpg',
    articles: [
      {
        title: title('Sleep stories for restless nights'),
        date: '2026-01-11',
        rate: 16,
        img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c63?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'When the mind rehearses tomorrow, a boring narrative helps more than advice. I describe a slow train ride through snow, station by station, until the details get smaller. Use this as a script to read aloud or record in your own voice. Keep the lights low and skip the plot twists.',
        ),
      },
      {
        title: title('Stretching that is not a workout'),
        date: '2026-08-03',
        rate: 5,
        img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Think of this as oiling hinges, not training for a race. Neck rolls, hip openers, and a long hang from a doorframe take twelve minutes. No playlist required. I wrote it for people who freeze when a class looks too athletic and still want to feel their body again.',
        ),
      },
    ],
  },
  {
    username: 'Elena Petrova',
    email: 'elena.petrova@harmoniq.seed',
    name: 'Elena Petrova',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_400,h_400/face_left.jpg',
    articles: [
      {
        title: title('Kind boundaries without the guilt'),
        date: '2026-04-19',
        rate: 21,
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'A boundary is a sentence plus a follow-through, not a speech. “I can talk after six” is enough. Guilt usually means you were trained to be available, not that you are selfish. I offer scripts for family, coworkers, and group chats, and what to do when someone tests the line.',
        ),
      },
      {
        title: title('Rest days that are truly off'),
        date: '2026-06-30',
        rate: 8,
        img: 'https://images.unsplash.com/photo-1506126279646-a697353d3166?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'An off day stuffed with laundry and inbox zero is still a workday. I choose one household task, one pleasure, and one empty hour. Protecting the empty hour is the whole point. Friends can join if they agree not to turn it into a project planning session.',
        ),
      },
    ],
  },
  {
    username: 'Omar Haddad',
    email: 'omar.haddad@harmoniq.seed',
    name: 'Omar Haddad',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_400,h_400/man.jpg',
    articles: [
      {
        title: title('Community circles that feel safe'),
        date: '2026-03-27',
        rate: 14,
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'A good circle has a timebox, a talking piece, and an agreement not to fix each other. I learned this in a small group that met twice a month. We left lighter, not drained. Here is a starter format for six people, including how to handle silence without panic.',
        ),
      },
      {
        title: title('Listening when you want to fix it'),
        date: '2026-07-19',
        rate: 4,
        img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Advice is often a way to escape someone else’s discomfort. Try reflecting one sentence, then asking “do you want ideas or just company?” That question changed my friendships. This article is for the helpers who interrupt with solutions and then wonder why people go quiet.',
        ),
      },
    ],
  },
  {
    username: 'Priya Nair',
    email: 'priya.nair@harmoniq.seed',
    name: 'Priya Nair',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_face,w_400,h_400/woman.jpg',
    articles: [
      {
        title: title('Mindful cooking on a weeknight'),
        date: '2026-02-28',
        rate: 12,
        img: 'https://images.unsplash.com/photo-1466637574441-749b8f2c4d40?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Put the phone in another room and notice the sound of oil, the color of onions, the steam. Dinner still has to happen. Mindfulness here is attention, not a ceremony. I walk through a thirty-minute dal and rice so you can try it tonight without a special grocery run.',
        ),
      },
      {
        title: title('Gardening in a rented balcony'),
        date: '2026-08-16',
        rate: 3,
        img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Three pots are enough: herbs, a leafy green, and one flower that you actually like. Watering in the morning becomes a check-in with weather and mood. Landlords and small spaces are constraints, not a veto. I list hardy plants and how to leave no stain on the tiles.',
        ),
      },
    ],
  },
  {
    username: 'James Oneill',
    email: 'james.oneill@harmoniq.seed',
    name: 'James Oneill',
    avatarUrl:
      'https://res.cloudinary.com/demo/image/upload/c_fill,g_auto,w_400,h_400/man.jpg',
    articles: [
      {
        title: title('Moving the body without a gym'),
        date: '2026-04-07',
        rate: 17,
        img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'Stairs, a park bench, and a timer replace most machines. I do squats, pushes against a wall, and a brisk walk. The goal is blood flow and a clearer head, not a new identity as an athlete. Start with twelve minutes and stop while you still feel willing to return tomorrow.',
        ),
      },
      {
        title: title('Music that helps you come down'),
        date: '2026-09-01',
        rate: 2,
        img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
        desc: paragraph(
          'After a noisy day the wrong playlist keeps the nervous system buzzing. I look for slow tempo, few lyrics, and songs I will not skip. This is not a ranked list of genius albums. It is a way to build an evening soundtrack that tells your body the emergency is over.',
        ),
      },
    ],
  },
];

await connectMongoDB();

try {
  const existing = await User.find({ email: SEED_EMAIL_RE }).select('_id');
  const existingIds = existing.map((user) => user._id);

  if (existingIds.length > 0) {
    await Article.deleteMany({ ownerId: { $in: existingIds } });
    await User.deleteMany({ _id: { $in: existingIds } });
    console.log(`Removed previous seed: ${existingIds.length} users`);
  }

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const createdUsers = [];

  for (const author of authors) {
    const user = await User.create({
      username: author.username,
      email: author.email,
      name: author.name,
      password: passwordHash,
      avatarUrl: author.avatarUrl,
      avatar: author.avatarUrl,
      articlesAmount: author.articles.length,
    });

    await Article.insertMany(
      author.articles.map((article) => ({
        ...article,
        author: author.name,
        ownerId: user._id,
      })),
    );

    createdUsers.push(user.email);
  }

  console.log(`Seeded ${createdUsers.length} users and ${createdUsers.length * 2} articles`);
  console.log(`Login password for all seed users: ${SEED_PASSWORD}`);
  console.log(createdUsers.join('\n'));
} finally {
  await mongoose.disconnect();
}

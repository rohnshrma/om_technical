// One-time / re-runnable seed script — creates indexes and inserts demo
// content so the site isn't empty on first deploy. Safe to re-run: it skips
// any document that already exists (matched by a natural unique key).
//
// Usage: npm run seed   (reads MONGODB_URI from .env.local via --env-file)

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'om_technical';

if (!uri) {
  console.error('Missing MONGODB_URI. Copy .env.example to .env.local and fill it in first.');
  process.exit(1);
}

const client = new MongoClient(uri);

async function upsertByKey(collection, key, doc) {
  const existing = await collection.findOne({ [key]: doc[key] });
  if (existing) return existing._id;
  const { insertedId } = await collection.insertOne(doc);
  return insertedId;
}

async function main() {
  await client.connect();
  const db = client.db(dbName);

  const universities = db.collection('universities');
  const courses = db.collection('courses');
  const testimonials = db.collection('testimonials');
  const blogPosts = db.collection('blogPosts');
  const leads = db.collection('leads');

  await Promise.all([
    blogPosts.createIndex({ slug: 1 }, { unique: true }),
    blogPosts.createIndex({ status: 1 }),
    courses.createIndex({ universityId: 1 }),
    courses.createIndex({ active: 1 }),
    leads.createIndex({ status: 1 }),
    leads.createIndex({ createdAt: -1 }),
  ]);
  console.log('Indexes ensured.');

  const universityDocs = [
    {
      name: 'Indira Gandhi National Open University',
      shortName: 'IGNOU',
      recognition: 'UGC-DEB Approved, NAAC A++',
      logoUrl: null,
      website: 'https://ignou.ac.in',
      description:
        "India's largest open university, offering UGC-DEB approved distance degree programs across streams.",
      createdAt: new Date(),
    },
    {
      name: 'Sikkim Manipal University - Distance Education',
      shortName: 'SMU-DE',
      recognition: 'UGC-DEB Approved',
      logoUrl: null,
      website: 'https://smude.edu.in',
      description:
        'Established distance learning wing of Sikkim Manipal University, offering management and technical programs.',
      createdAt: new Date(),
    },
    {
      name: 'Annamalai University - Directorate of Distance Education',
      shortName: 'Annamalai DDE',
      recognition: 'UGC-DEB Approved',
      logoUrl: null,
      website: 'https://annamalaiuniversity.ac.in',
      description:
        'One of the oldest distance education directorates in India, NAAC accredited.',
      createdAt: new Date(),
    },
    {
      name: 'Chandigarh University',
      shortName: 'CU',
      recognition: 'UGC Approved, NAAC A+',
      logoUrl: null,
      website: 'https://cuchd.in',
      description:
        'NAAC A+ accredited university offering regular degree programs across technical and management streams.',
      createdAt: new Date(),
    },
  ];

  const universityIdByName = new Map();
  for (const doc of universityDocs) {
    const id = await upsertByKey(universities, 'name', doc);
    universityIdByName.set(doc.name, id);
  }
  console.log(`Universities ready: ${universityIdByName.size}`);

  const courseDocs = [
    {
      name: 'Master of Business Administration (MBA)',
      category: 'Management',
      mode: 'Distance',
      universityName: 'Sikkim Manipal University - Distance Education',
      duration: '2 Years',
      eligibility: 'Graduation in any discipline from a recognized university',
      description:
        'UGC-DEB approved distance MBA with specializations in Marketing, Finance, HR and Operations — recognized for government and private sector roles.',
    },
    {
      name: 'Bachelor of Business Administration (BBA)',
      category: 'Distance Degree',
      mode: 'Distance',
      universityName: 'Indira Gandhi National Open University',
      duration: '3 Years',
      eligibility: '10+2 from a recognized board',
      description:
        'Foundational management degree covering business fundamentals, accounting, and organizational behavior.',
    },
    {
      name: 'Master of Computer Applications (MCA)',
      category: 'Technical',
      mode: 'Distance',
      universityName: 'Annamalai University - Directorate of Distance Education',
      duration: '2 Years',
      eligibility: "Bachelor's degree with Mathematics at 10+2 or graduation level",
      description:
        'Postgraduate technical degree covering programming, systems design, and modern application development.',
    },
    {
      name: 'Bachelor of Computer Applications (BCA)',
      category: 'Distance Degree',
      mode: 'Distance',
      universityName: 'Indira Gandhi National Open University',
      duration: '3 Years',
      eligibility: '10+2 from a recognized board',
      description: 'Entry-level technical degree building programming and computer systems fundamentals.',
    },
    {
      name: 'B.Tech Computer Science & Engineering',
      category: 'Technical',
      mode: 'Regular',
      universityName: 'Chandigarh University',
      duration: '4 Years',
      eligibility: '10+2 with Physics, Chemistry, Mathematics',
      description:
        'On-campus regular engineering degree with industry-aligned curriculum and placement support.',
    },
    {
      name: 'MBA (Regular)',
      category: 'Management',
      mode: 'Regular',
      universityName: 'Chandigarh University',
      duration: '2 Years',
      eligibility: 'Graduation in any discipline with qualifying entrance score',
      description: 'On-campus regular MBA program with specialization tracks and industry immersion.',
    },
  ];

  let courseCount = 0;
  for (const { universityName, ...rest } of courseDocs) {
    const existing = await courses.findOne({ name: rest.name, mode: rest.mode });
    if (existing) continue;
    await courses.insertOne({
      ...rest,
      universityId: universityIdByName.get(universityName) || null,
      active: true,
      createdAt: new Date(),
    });
    courseCount++;
  }
  console.log(`Courses inserted: ${courseCount}`);

  const testimonialDocs = [
    {
      studentName: 'Ritu Sharma',
      course: 'MBA (Distance)',
      quote:
        'OM Technical guided me honestly through my entire admission process — no false promises, just clear information about UGC-approved options. I completed my MBA while working full-time.',
      rating: 5,
      photoUrl: null,
      featured: true,
    },
    {
      studentName: 'Vikram Malhotra',
      course: 'MCA (Distance)',
      quote:
        'What I appreciated most was the transparency. They explained exactly which universities were properly recognized before I paid a single rupee anywhere.',
      rating: 5,
      photoUrl: null,
      featured: true,
    },
    {
      studentName: 'Ananya Gupta',
      course: 'BBA (Distance)',
      quote:
        'Balram Sir personally sat with me to explain my options. Having a real office in Sector 14 made me trust them over the phone-only agents I had spoken to before.',
      rating: 5,
      photoUrl: null,
      featured: true,
    },
  ];

  let testimonialCount = 0;
  for (const doc of testimonialDocs) {
    const existing = await testimonials.findOne({ studentName: doc.studentName });
    if (existing) continue;
    await testimonials.insertOne({ ...doc, createdAt: new Date() });
    testimonialCount++;
  }
  console.log(`Testimonials inserted: ${testimonialCount}`);

  const blogDocs = [
    {
      title: 'Difference Between Distance and Regular Degree Programs in India',
      slug: 'difference-between-distance-and-regular-degree',
      content: `## Understanding the Two Paths

Many students in Gurugram ask us whether a distance degree carries the same value as a regular one. Here is a clear, honest breakdown.

### Regular Degree
- Requires physical class attendance
- Fixed academic calendar
- Best suited for students without work commitments

### Distance Degree
- Studied remotely with periodic study material and online support
- Ideal for working professionals
- Must be from a **UGC-DEB approved** university to be valid for most government jobs

### Our Advice
Always verify UGC-DEB approval status before enrolling anywhere. OM Technical only facilitates admissions to recognized universities — ask us for the current approval list.`,
      excerpt:
        'A clear, honest comparison of distance and regular degree programs — and why UGC-DEB approval status matters most.',
      featuredImage: null,
      metaTitle: 'Distance vs Regular Degree: Which is Right for You? | OM Technical',
      metaDescription:
        'Understand the real differences between distance and regular degree programs in India, and why UGC-DEB approval matters before you enroll.',
      status: 'published',
      category: 'Guidance',
      tags: ['distance education', 'regular degree', 'UGC DEB'],
    },
    {
      title: 'Is a Distance MBA Valid for Government Jobs?',
      slug: 'is-distance-mba-valid-for-government-jobs',
      content: `## Short Answer: Yes — If It Meets This One Condition

A distance MBA is valid for government job eligibility **only if the university is UGC-DEB approved** for that specific program and academic year.

### What to Check
1. UGC-DEB approved university list for the admission year
2. Whether the specific program (not just the university) is on the approved list
3. Physical counselling from a center that can show you the approval documents

At OM Technical, we walk every student through the current approval list before recommending any university — because your career depends on getting this right the first time.`,
      excerpt:
        'A distance MBA is valid for government jobs only under specific UGC-DEB conditions. Here is exactly what to verify before you enroll.',
      featuredImage: null,
      metaTitle: 'Is Distance MBA Valid for Government Jobs? | OM Technical Gurugram',
      metaDescription:
        'Find out when a distance MBA is valid for government job eligibility in India, and how to verify UGC-DEB approval before enrolling.',
      status: 'published',
      category: 'Guidance',
      tags: ['distance MBA', 'government jobs', 'UGC DEB'],
    },
    {
      title: 'UGC-DEB Approved Universities: How to Verify Before You Enroll',
      slug: 'ugc-deb-approved-universities-how-to-verify',
      content: `## Protect Yourself From Fraudulent Admission Agents

Every year, students in Gurugram and across India lose money to agents promising degrees from universities that are not actually UGC-DEB approved for distance education.

### How to Verify
1. Visit the official UGC-DEB portal and search the university name
2. Confirm the specific program is listed, not just the university
3. Ask your admission center for the approval document in writing
4. Prefer centers with a real, visitable office — like our Sector 14 office

OM Technical has operated from the same physical address in Gurugram since 2006. We encourage every student to verify our guidance independently before enrolling.`,
      excerpt:
        'Learn exactly how to verify UGC-DEB approval status before enrolling in any distance degree program, and how to avoid admission fraud.',
      featuredImage: null,
      metaTitle: 'How to Verify UGC-DEB Approved Universities | OM Technical',
      metaDescription:
        'A step-by-step guide to verifying UGC-DEB approved universities before enrolling, so you avoid admission fraud in distance education.',
      status: 'published',
      category: 'Guidance',
      tags: ['UGC DEB', 'admission fraud', 'distance education'],
    },
    {
      title: 'UG & PG Admission Guidance in Gurugram, Delhi & NCR: A Student’s Checklist',
      slug: 'ug-pg-admission-guidance-gurugram-delhi-ncr',
      content: `## Choosing the Right Undergraduate or Postgraduate Path

Students across Gurugram, Delhi, Noida, and Faridabad face the same core decision every admission season: which UG or PG course, which mode (distance or regular), and which university actually delivers on its promises.

### Questions to Ask Before You Enroll Anywhere in the NCR
1. Is the university UGC-DEB approved for this specific program and year (for distance courses)?
2. Does the admission center have a real, visitable office — not just a phone number and a WhatsApp account?
3. Can they show you official recognition documents in writing, without pressure to pay first?
4. Do they list courses and university tie-ups clearly, or only vague promises?

### Why Location Still Matters, Even for Distance Programs
Even though distance education doesn't require regular attendance, having a local counsellor in Gurugram who understands NCR students' specific concerns — commute for regular programs, employer recognition for distance degrees, and document verification — makes the process far less confusing than dealing with a call-center-only agent.

### Our Approach
OM Technical has guided UG and PG admissions for students across Gurugram, Delhi, and the wider NCR since 2006, from the same Sector 14 office. We only work with recognized, UGC-approved university tie-ups, and we never charge for an initial consultation.`,
      excerpt:
        'A practical checklist for choosing a UG or PG distance or regular degree course in Gurugram, Delhi, or the NCR — and how to spot a genuine admission counsellor.',
      featuredImage: null,
      metaTitle: 'UG & PG Admission Guidance in Gurugram, Delhi & NCR | OM Technical',
      metaDescription:
        'A student checklist for choosing UG/PG distance or regular degree courses in Gurugram, Delhi & NCR, and how to verify a genuine admission consultancy.',
      status: 'published',
      category: 'Guidance',
      tags: ['UG admission', 'PG admission', 'Delhi NCR', 'Gurugram'],
    },
  ];

  let blogCount = 0;
  for (const doc of blogDocs) {
    const existing = await blogPosts.findOne({ slug: doc.slug });
    if (existing) continue;
    await blogPosts.insertOne({
      ...doc,
      publishedAt: doc.status === 'published' ? new Date() : null,
      createdAt: new Date(),
    });
    blogCount++;
  }
  console.log(`Blog posts inserted: ${blogCount}`);

  console.log('\nSeed complete.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(() => client.close());

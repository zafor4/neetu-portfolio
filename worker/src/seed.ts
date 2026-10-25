import { hashPassword } from './auth';
import { newId, nowIso } from './mappers';
import { SCHEMA_SQL } from './schema';

async function countRows(db: D1Database, table: string): Promise<number> {
  const row = await db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).first<{ n: number }>();
  return Number(row?.n || 0);
}

export async function ensureReady(db: D1Database): Promise<void> {
  const statements = SCHEMA_SQL.split(';').map((sql) => sql.trim()).filter(Boolean);
  for (const sql of statements) {
    await db.prepare(sql).run();
  }

  if ((await countRows(db, 'users')) === 0) {
    await db
      .prepare('INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(newId(), 'admin@arzooman.com', await hashPassword('admin123'), 'admin', nowIso())
      .run();
  }

  if ((await countRows(db, 'profile')) === 0) {
    await db
      .prepare(
        `INSERT INTO profile (
          id, name, title, location, statement, available_for_work, resume_url, avatar_url,
          show_hero, show_projects, show_experience, show_skills, show_github, show_publications,
          show_activities, show_contact, updated_at
        ) VALUES (?, ?, ?, ?, ?, 1, ?, ?, 1, 1, 1, 1, 1, 1, 1, 1, ?)`,
      )
      .bind(
        newId(),
        'Humayra Arzooman',
        'UI/UX Designer & Product Designer',
        'Dhaka, Bangladesh',
        '[A product-focused Designer & Founder from Bangladesh, building high-performance digital experiences where modern design meets scalable technology, cloud innovation, and intelligent solutions.]',
        '/resume.pdf',
        '/assets/adina.jpeg',
        nowIso(),
      )
      .run();
  }

  if ((await countRows(db, 'contact')) === 0) {
    await db
      .prepare(
        `INSERT INTO contact (
          id, location, email, linkedin, github, figma, twitter, github_username, office_image_url, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        newId(),
        'DHAKA, BANGLADESH',
        'adinahawaldar895@gmail.com',
        'https://linkedin.com/in/adina-hawaldar-17az6',
        'https://github.com/adinahawaldar',
        'https://figma.com/@adinahawaldar',
        'https://twitter.com/@adina_hawaldar',
        'adinahawaldar',
        '/assets/professional_office.png',
        nowIso(),
      )
      .run();
  }

  if ((await countRows(db, 'projects')) === 0) {
    const created = nowIso();
    const projects = [
      ['Tech Meet', 'website', '/assets/snippit.png', 'Automated recruitment platform using the M-Smart hybrid AI matching model for candidate profiling, ranking, and shortlisting.', ['Next.js', 'Express.js', 'FastAPI', 'Python', 'AI'], 'https://github.com/zafor4/tech-meet', 'https://portfolio-client-five-ebon.vercel.app', '', 1],
      ['Bhubanmajhi', 'website', '/assets/zentra.png', 'Full-stack travel booking platform covering tour, hotel, flight, and reservation workflows; integrated SSLCommerz payment and booking management.', ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'SSLCommerz'], 'https://github.com/zafor4/bhubanmajhi', '', '', 2],
      ['Surveillance & Mapping System', 'website', '/assets/autovion.png', 'Real-time surveillance and mapping system supporting live tracking, ride-sharing, and delivery workflows.', ['React Native', 'React.js', 'Node.js', 'WebSockets', 'MapLibre'], 'https://github.com/zafor4/surveillance-system', '', '', 3],
      ['eFamily Court Judiciary Platform', 'website', '/assets/smartchain.png', 'Digital paperless judiciary platform developed at CSE Tech for judicial user interface workflows and API integration.', ['Next.js', 'React.js', 'NestJS', 'Prisma', 'PostgreSQL'], '', '', '', 4],
    ] as const;

    await db.batch(
      projects.map(([title, type, image, description, technologies, github, live, figma, sortOrder]) =>
        db
          .prepare(
            `INSERT INTO projects (id, title, type, image, description, technologies, github, live, figma, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(newId(), title, type, image, description, JSON.stringify(technologies), github, live, figma, sortOrder, created, created),
      ),
    );
  }

  if ((await countRows(db, 'experiences')) === 0) {
    const created = nowIso();
    const rows = [
      ['CSE Tech', 'Software Engineer (Frontend)', '01/2026 – Present', 'Develop enterprise web applications using Next.js, React.js, NestJS, and PostgreSQL. Rebuilt company portfolio and digital paperless judiciary platform eFamily Court. Guide junior developers and interns.', 1],
      ['Fawz Biz Enterprises', 'Full Stack Developer & Database Specialist', '02/2026 – Present', 'Design relational & non-relational database structures, SQL queries, Prisma ORM integrations, and RESTful APIs for enterprise software projects.', 2],
      ['SharpBD IT Solution', 'Frontend Developer', '04/2025 – 09/2025', 'Developed real-time surveillance & mapping system using WebSockets & MapLibre, and full-stack travel booking platform.', 3],
      ['SharpBD IT Solution', 'React.js Developer (Intern)', '01/2025 – 04/2025', 'Integrated RESTful APIs using Axios and built responsive user interfaces using Bootstrap and CSS.', 4],
    ] as const;

    await db.batch(
      rows.map(([company, role, duration, desc, sortOrder]) =>
        db
          .prepare('INSERT INTO experiences (id, company, role, duration, desc, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(newId(), company, role, duration, desc, sortOrder, created),
      ),
    );
  }

  if ((await countRows(db, 'skills')) === 0) {
    const rows = [
      ['C++', 'Programming & CS', 'Code2', 'bg-[#00599C]', 'text-white', 1],
      ['Python', 'Programming & AI', 'Terminal', 'bg-[#3776ab]', 'text-white', 2],
      ['JavaScript & TS', 'Programming & Web', 'Code2', 'bg-[#f7df1e]', 'text-black', 3],
      ['React.js & Next.js', 'Frontend Engineering', 'Layout', 'bg-[#61dafb]', 'text-black', 4],
      ['NestJS & Node.js', 'Backend Engineering', 'Server', 'bg-[#E0234E]', 'text-white', 5],
      ['PostgreSQL & MySQL', 'Database Systems', 'Database', 'bg-[#4169E1]', 'text-white', 6],
      ['MongoDB', 'NoSQL Databases', 'Database', 'bg-[#47a248]', 'text-white', 7],
      ['Prisma ORM', 'Database ORM', 'Layers', 'bg-[#2D3748]', 'text-white', 8],
      ['Machine Learning & Deep Learning', 'AI & Research', 'Cpu', 'bg-[#ff007f]', 'text-white', 9],
      ['Data Structures & Algorithms', 'CS Fundamentals', 'Cpu', 'bg-foreground', 'text-background', 10],
      ['Docker & Git', 'Tools & DevOps', 'GitBranch', 'bg-[#2496ED]', 'text-white', 11],
      ['Tailwind CSS', 'Styling Framework', 'Layout', 'bg-[#38bdf8]', 'text-white', 12],
      ['WebSockets & MapLibre', 'Real-time & Maps', 'Cloud', 'bg-[#ff9900]', 'text-black', 13],
    ] as const;

    await db.batch(
      rows.map(([name, category, icon, bg, color, sortOrder]) =>
        db
          .prepare('INSERT INTO skills (id, name, category, icon, bg, color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(newId(), name, category, icon, bg, color, sortOrder),
      ),
    );
  }

  if ((await countRows(db, 'publications')) === 0) {
    const created = nowIso();
    const rows = [
      [
        'Enhanced Agricultural Productivity: Dragon Fruit Leaf Disease Detection Using Deep Learning Models',
        'International Conference on Intelligent Data Analysis and Applications (IDAA 2025)',
        'Dec 2025',
        'MD ZAFOR IQBAL, et al.',
        'Published research proposing an automated deep learning framework for accurate identification and classification of dragon fruit leaf diseases to increase agricultural crop yield.',
        '10.1007/IDAA2025',
        '/documents/dragon_fruit_research.pdf',
        'https://github.com/zafor4',
        ['Deep Learning', 'Computer Vision', 'Agricultural AI', 'Image Classification'],
        1,
      ],
      [
        'M SMART: An Automated Multi Stage Semantic Evaluation Pipeline for Job Candidate Compatibility Assessment in the Tech Industry',
        'The International Conference on Recent Progresses in Science, Engineering and Technology (ICRPSET-2026)',
        '2026',
        'MD ZAFOR IQBAL, et al.',
        'Submitted research paper introducing an automated AI semantic evaluation pipeline for candidate resume profiling, skill matching, and technical compatibility scoring.',
        '',
        '/documents/msmart_research.pdf',
        '',
        ['NLP', 'Sentence Transformers', 'Semantic Matching', 'AI Recruitment'],
        2,
      ],
    ] as const;

    await db.batch(
      rows.map(([title, publisher, year, authors, abstract, doi, pdfUrl, link, tags, sortOrder]) =>
        db
          .prepare(
            `INSERT INTO publications (id, title, publisher, year, authors, abstract, doi, pdf_url, link, tags, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(newId(), title, publisher, year, authors, abstract, doi, pdfUrl, link, JSON.stringify(tags), sortOrder, created, created),
      ),
    );
  }

  if ((await countRows(db, 'activities')) === 0) {
    const created = nowIso();
    const rows = [
      ['React.js Course Instructor', 'Teaching & Instruction', 'NCSA-EDGE Project Training Program (BCC & ICT Division) | Daffodil International University', '05/2026 – 06/2026', 'Instructed the "SPA Development with React.js" course for 25+ learners through hands-on coding sessions, state management, REST API integration, and deployment practices.', '/assets/professional_office.png', 'https://github.com/zafor4', 1],
      ['M.Sc. in Computer Science & Engineering', 'Education & Academics', 'Daffodil International University, Dhaka', '05/2026 – Present', 'Advanced graduate studies focused on Data Mining, Machine Learning, and Distributed Software Architectures.', '/assets/autovion.png', '', 2],
      ['B.Sc. in Computer Science & Engineering (CGPA: 3.80/4.00)', 'Education & Academics', 'Daffodil International University, Dhaka', '01/2022 – 12/2025', 'Graduated with high distinction (CGPA 3.80/4.00). Specialized in Software Engineering, Algorithms, and Machine Learning.', '/assets/zentra.png', '', 3],
    ] as const;

    await db.batch(
      rows.map(([title, category, organization, date, description, image, link, sortOrder]) =>
        db
          .prepare(
            `INSERT INTO activities (id, title, category, organization, date, description, image, link, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(newId(), title, category, organization, date, description, image, link, sortOrder, created, created),
      ),
    );
  }
}

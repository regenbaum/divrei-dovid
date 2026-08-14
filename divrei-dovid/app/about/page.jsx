export const metadata = {
  title: 'About Rabbi David Ebner zt"l',
  description:
    'The life of Rabbi David (Dovid) Ebner zt"l, and the project preserving his Torah at Divrei Dovid.',
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rabbi David Ebner',
    alternateName: 'Rav Dovid Ebner',
    birthDate: '1945',
    deathDate: '2025-09-07',
    deathPlace: 'Jerusalem, Israel',
    description:
      'Rosh Yeshiva and educator at Yeshivat HaMivtar and Yeshivat Eretz HaTzvi; poet; founder of ATID.',
    affiliation: [
      { '@type': 'Organization', name: 'Yeshivat HaMivtar' },
      { '@type': 'Organization', name: 'Yeshivat Eretz HaTzvi' },
      { '@type': 'Organization', name: 'ATID' },
    ],
  }

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1>About This Project</h1>
      <p>
        Divrei Dovid is an effort by students, colleagues, and family of
        Rabbi David Ebner zt&quot;l to gather, preserve, and share his Torah
        in one accessible home online &mdash; the thousands of hours of
        recorded shiurim and chavrutot, his essays, his poetry, and the
        marginalia he left in the margins of his own sefarim.
      </p>
      <p>
        Much of this material has never been made public. It exists in
        scattered recordings on old hard drives, in a partial archive on
        Google Drive, and in notebooks and papers still in the possession of
        his family. Our hope is that his talmidim &mdash; and those who never
        had the chance to learn from him &mdash; will be able to find their
        way back to his voice.
      </p>
      <p>
        This project is being carried forward by a group of his students,
        undertaken with the knowledge and support of Rabbi Ebner&rsquo;s
        family, and in partnership with Yeshivat Eretz Hatzvi. If you have
        recordings, notes, or materials of his you&rsquo;d be willing to
        share &mdash; or if you&rsquo;d like to help organize, transcribe, or
        support this work &mdash; we&rsquo;d love to hear from you.
      </p>
      <p><a className="btn btn-outline" href="/get-involved">Get Involved</a></p>

      <h2>Rabbi David Ebner zt&quot;l (1945&ndash;2025)</h2>
      <figure className="portrait-frame">
        <img src="/rabbi-ebner.jpg" alt="Rabbi David Ebner zt&quot;l" />
        <figcaption>Rabbi David Ebner zt&quot;l</figcaption>
      </figure>

      <p>
        Rabbi David Ebner was born in Bradford, Pennsylvania, in 1945. He
        received semikha from Yeshiva University, where he studied under
        Rabbi Joseph B. Soloveitchik, and went on to pursue graduate studies
        in sociology and Talmud. Before making aliyah, he taught sociology
        and served as Assistant Director of the Institute for Jewish Life of
        the United Jewish Communities.
      </p>
      <p>
        In 1982, Rabbi Ebner and his family moved to Israel, where his
        life&rsquo;s true calling emerged. For more than two decades he
        served as Mashgiach Ruchani at Yeshivat HaMivtar in Jerusalem and
        Efrat, alongside his close friend and partner Rabbi Chaim Brovender.
        He later helped found Yeshivat Eretz HaTzvi in Jerusalem, where he
        served as Rosh Yeshiva and spiritual guide. He was also one of the
        founders of ATID, where he mentored generations of Jewish educators,
        and he taught for years at ATID&ndash;WebYeshiva.org.
      </p>
      <p>
        Generations of students remember him not only as a teacher of
        Gemara, but as a rebbe who wove together Halacha, Chassidut, poetry,
        art, psychology, and literature into what one former talmid called a
        &ldquo;Library of Everything.&rdquo; He was as comfortable discussing
        the Sfas Emes as he was J.D. Salinger, and he taught his students to
        bring their whole selves &mdash; doubts, gifts, and all &mdash; into
        the Beit Midrash. Many describe him as a confidant as much as a
        teacher: someone who carried their questions and struggles with deep
        trust and quiet care.
      </p>
      <p>
        Rabbi Ebner was also a poet, publishing three collections: <em>The
        Library of Everything</em>, <em>Perhaps This Poem</em>, and{' '}
        <em>Dance Words</em>. His writing, like his teaching, moved fluidly
        between the sacred and the everyday, reflecting his belief that
        beauty &mdash; in art, music, and language &mdash; was itself a
        doorway to something greater.
      </p>
      <p>
        Rabbi Ebner passed away in Jerusalem on September 7, 2025, at the age
        of 80. He is remembered by his family, his many students across the
        world, and everyone whose life he touched.
      </p>
      <p style={{ textAlign: 'center', fontSize: '20px' }}>יהי זכרו ברוך</p>
      <p className="subtitle">
        Bio compiled from Tradition Online, the London School of Jewish
        Studies, Eretz Hatzvi, ATID, and tributes written by his students.
        Corrections and additions are welcome &mdash;{' '}
        <a href="/get-involved">let us know</a>.
      </p>
    </div>
  )
}

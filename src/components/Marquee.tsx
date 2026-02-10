const ITEMS = [
  'React', 'TypeScript', 'Python', 'Java', 'C#', 'Rust', 'OCaml',
  'Flask', '.NET', 'Node.js', 'Docker', 'Azure', 'AWS',
  'PyTorch', 'OAuth2', 'REST APIs', 'CI/CD', 'GitHub Actions',
  'SQL', 'MongoDB', 'UNIX/Linux', 'Bash',
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee-section">
      <div className="marquee-label">
        <span className="marquee-prompt">&gt;</span> tech_stack
      </div>
      <div className="marquee-track">
        <div className="marquee-content">
          {doubled.map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

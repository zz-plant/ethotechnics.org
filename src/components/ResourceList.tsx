export type Resource = {
  title: string;
  description: string;
  href: string;
  badge?: string;
};

interface ResourceListProps {
  eyebrow: string;
  heading: string;
  intro: string;
  resources: Resource[];
}

export default function ResourceList({ eyebrow, heading, intro, resources }: ResourceListProps) {
  return (
    <section className="section">
      <div className="section__header">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{heading}</h2>
        <p className="muted">{intro}</p>
      </div>
      <div className="grid grid--two">
        {resources.map((resource) => (
          <article className="card" key={resource.href}>
            <div className="resource__title-row">
              <h3>{resource.title}</h3>
              {resource.badge && <span className="pill">{resource.badge}</span>}
            </div>
            <p className="muted">{resource.description}</p>
            <a className="resource__link" href={resource.href} rel="noreferrer">
              Explore resource
              <span aria-hidden="true">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

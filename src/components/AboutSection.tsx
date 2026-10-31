import { profile } from "@/data/profile";
import { isAvailable } from "@/lib/public-files";
import { Portrait } from "./Portrait";
import { RichText, SmartLink } from "./RichText";
import { Section } from "./Section";

export function AboutSection() {
  const links = profile.links.filter((l) => isAvailable(l.href));
  const portrait = profile.portrait && isAvailable(profile.portrait) ? profile.portrait : "";

  return (
    <Section
      id="about"
      title="About"
      aside={portrait ? <Portrait src={portrait} alt={`Portrait of ${profile.name}`} /> : undefined}
    >
      <p className="lede"><RichText text={profile.lede} /></p>
      {profile.bio.map((para, i) => (
        <p key={i}><RichText text={para} /></p>
      ))}
      {links.length > 0 && (
        <ul className="links">
          {links.map((link) => (
            <li key={link.label}>
              <SmartLink href={link.href}>{link.label}</SmartLink>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

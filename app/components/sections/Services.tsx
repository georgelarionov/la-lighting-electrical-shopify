import servicesImg from '~/assets/services.jpg?url';
import {ArrowLink} from '~/components/ArrowLink';

/**
 * Dark full-bleed services tile (Pencil "Services Section" QjiVe, fill $tile):
 * centered headline + tagline + sky text link, then a full-bleed image below.
 */
export function Services() {
  return (
    <section id="services" className="dark scroll-mt-24 bg-onyx text-white">
      <div className="flex flex-col items-center gap-11 pt-20 md:pt-24">
        <div className="container-page flex flex-col items-center text-center">
          <h2 className="type-display max-w-[18ch] text-white text-balance">
            Lighting design, handled end to end.
          </h2>
          <p className="type-lead mt-5 max-w-[42ch] text-white/70">
            Photometric layouts, Title 24 compliance, and a licensed crew that
            installs what we draw.
          </p>
          <ArrowLink to="/services" className="type-body mt-6 text-white">
            See our services
          </ArrowLink>
        </div>

        <img
          src={servicesImg}
          alt="A licensed crew installing architectural lighting"
          width={2000}
          height={667}
          loading="lazy"
          className="aspect-[3/1] w-full object-cover"
        />
      </div>
    </section>
  );
}

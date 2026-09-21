'use client';

import { BookSection } from '@/components/sections/BookSection';
import { StageOverlays } from '@/components/sections/Hero';
import { Industries } from '@/components/sections/Industries';
import { Process } from '@/components/sections/Process';
import { Services } from '@/components/sections/Services';
import { WhyUs } from '@/components/sections/WhyUs';
import { MascotStage } from '@/components/sequence/MascotStage';
import { StickyEmblem } from '@/components/layout/StickyEmblem';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function HomePage() {
  return (
    <>
      {/* Hero, Who We Are and the services intro all play out over the pinned
          mascot, choreographed to its poses. */}
      <MascotStage>{(progress) => <StageOverlays progress={progress} />}</MascotStage>

      {/* Everything after the stage shares one layer for the background logo,
          so it can stay pinned while these sections scroll past. */}
      <div className="relative">
        <StickyEmblem />
        <Services />
        <SectionDivider />
        <Industries />
        <WhyUs />
        <SectionDivider />
        <Process />
        <BookSection />
      </div>
    </>
  );
}

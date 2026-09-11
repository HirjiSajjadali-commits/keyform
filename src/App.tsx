import { useSmoothScroll } from './hooks/useSmoothScroll';
import { KeyboardStage } from './three/KeyboardStage';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Configurator } from './sections/Configurator';
import { Spec } from './sections/Spec';
import { Made } from './sections/Made';
import { Details } from './sections/Details';
import { Voices } from './sections/Voices';
import { PreOrder } from './sections/PreOrder';
import { Footer } from './sections/Footer';

function App() {
  useSmoothScroll();

  return (
    <>
      <KeyboardStage />
      <Header />
      <main>
        <Hero />
        <Configurator />
        <Spec />
        <Made />
        <Details />
        <Voices />
        <PreOrder />
      </main>
      <Footer />
    </>
  );
}

export default App;

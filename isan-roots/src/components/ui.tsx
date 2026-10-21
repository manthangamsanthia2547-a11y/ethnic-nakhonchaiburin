import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';

export const image = (name: string) => `assets/images/${name}`;
export const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => diagonal
  ? <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" />
  : <ArrowRight size={22} strokeWidth={1.5} aria-hidden="true" />;
export const SearchIcon = () => <Search size={22} strokeWidth={1.5} aria-hidden="true" />;
export const NumberLabel = ({ number, children }: { number: string; children: ReactNode }) =>
  <div className="mh-eyebrow"><span>{number}</span><span className="mh-eyebrow-line" />{children}</div>;

export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (element.getBoundingClientRect().top > innerHeight) element.classList.add('ref-reveal-pending');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.classList.remove('ref-reveal-pending');
        observer.disconnect();
      }
    }, { rootMargin: '0px 0px 60px 0px', threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div className="ref-reveal" ref={ref} onFocusCapture={() => ref.current?.classList.remove('ref-reveal-pending')}>{children}</div>;
}

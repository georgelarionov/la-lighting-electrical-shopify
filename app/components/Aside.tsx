import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react';
import {X} from 'lucide-react';
import {cn} from '~/lib/utils';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A slide-over panel with a frosted backdrop. Same context API as the
 * skeleton (open/close/useAside); restyled with Tailwind + brand tokens.
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  useEffect(() => {
    const abortController = new AbortController();
    if (expanded) {
      document.addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
          if (event.key === 'Escape') close();
        },
        {signal: abortController.signal},
      );
      document.body.style.overflow = 'hidden';
    }
    return () => {
      abortController.abort();
      document.body.style.overflow = '';
    };
  }, [close, expanded]);

  return (
    <div
      aria-modal
      role="dialog"
      aria-labelledby={id}
      aria-hidden={!expanded}
      className={cn(
        'fixed inset-0 z-[100] transition-opacity duration-300',
        expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-black/40 backdrop-blur-sm"
      />
      {/* Panel */}
      <aside
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-canvas shadow-product transition-transform duration-300 ease-out',
          expanded ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h3 id={id} className="type-body-strong text-ink">
            {heading}
          </h3>
          <button
            className="inline-flex size-9 items-center justify-center rounded-[2px] text-ink transition-colors hover:bg-parchment"
            onClick={close}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

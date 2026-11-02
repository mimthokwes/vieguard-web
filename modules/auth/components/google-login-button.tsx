'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';
import { googleLoginAction } from '../actions';

interface GoogleLoginButtonProps {
  next?: string;
  label?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
        };
      };
    };
  }
}

export function GoogleLoginButton({ next, label = 'Lanjutkan dengan Google' }: GoogleLoginButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  const handleCredentialResponse = (response: { credential?: string }) => {
    if (!response.credential) {
      setError('Gagal menerima kredensial dari Google.');
      return;
    }

    startTransition(async () => {
      setError('');
      try {
        const result = await googleLoginAction(response.credential!, next);
        if (result?.error) {
          setError(result.error);
        }
      } catch (err: any) {
        // Next.js redirect throws a special internal error (NEXT_REDIRECT), do not catch it as error
        if (err?.message !== 'NEXT_REDIRECT') {
          setError(err?.message || 'Login dengan Google gagal.');
        }
      }
    });
  };

  useEffect(() => {
    if (!scriptLoaded || !clientId || typeof window === 'undefined' || !window.google) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center',
        });
      }
    } catch (err) {
      console.error('Google Sign-In initialization error:', err);
    }
  }, [scriptLoaded, clientId]);

  const handleCustomClick = () => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError('Layanan Google Sign-In sedang dimuat, silakan coba sesaat lagi.');
    }
  };

  return (
    <div className="w-full">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      {error && (
        <div className="mb-3 rounded-xl border border-danger/20 bg-danger-bg p-3 text-xs text-danger">
          {error}
        </div>
      )}

      {isPending ? (
        <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface text-sm font-semibold text-ink shadow-soft">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Menghubungkan akun Google...</span>
        </div>
      ) : (
        <div className="relative w-full">
          {/* Official Google Rendered Button (hidden under custom if customized or shown directly) */}
          <div ref={buttonContainerRef} className="w-full flex justify-center [&>div]:w-full" />

          {/* Fallback button if Google script is loading or blocked by extensions */}
          {!scriptLoaded && (
            <button
              type="button"
              onClick={handleCustomClick}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink shadow-soft transition-colors hover:bg-beige-soft active:scale-[0.99]"
            >
              <GoogleIcon />
              <span>{label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

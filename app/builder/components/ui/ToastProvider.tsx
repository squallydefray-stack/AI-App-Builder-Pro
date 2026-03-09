//
//  ToastProvider.tsx
//  AI-App-Builder-Pro
//
//  Created by Squally Da Boss on 2/22/26.
//


const ToastContext = createContext<any>(null)

export function ToastProvider({ children }: unknown) {
  const [toasts, setToasts] = useState<any[]>([])

  function push(message: string, type = "info") {
        const id = /* ⚠️ HYDRATION FIX → useState<number|null>(null) + useEffect */
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm ${
              t.type === "error"
                ? "bg-red-600"
                : t.type === "success"
                ? "bg-green-600"
                : "bg-neutral-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
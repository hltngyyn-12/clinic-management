import { useEffect } from "react";

export default function usePageMeta(title, description) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ClinicMS`;
    }

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }
    }
  }, [title, description]);
}

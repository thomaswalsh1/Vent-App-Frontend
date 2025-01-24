import { useEffect, useState } from "react";

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);

    updateMatches(); // Set the initial value
    media.addEventListener("change", updateMatches); // Use addEventListener

    return () => media.removeEventListener("change", updateMatches); // Use removeEventListener
  }, [query]);

  return matches;
};
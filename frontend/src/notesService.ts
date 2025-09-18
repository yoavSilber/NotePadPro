import axios from "axios";
import { Note } from "./Note";
import { notesCache } from "./services/cacheService";

const API_URL = "http://localhost:3001/notes";
const POSTS_PER_PAGE = 10;

export const getNotes = async (
  page: number
): Promise<{ notes: Note[]; totalPages: number }> => {
  // Check cache first
  const cachedEntry = notesCache.get(page);
  if (cachedEntry) {
    console.log(`Loading page ${page} from cache`);
    return { notes: cachedEntry.notes, totalPages: cachedEntry.totalPages };
  }

  try {
    console.log(`Fetching page ${page} from server`);
    const response = await axios.get<Note[]>(API_URL, {
      params: {
        _page: page,
        _per_page: POSTS_PER_PAGE,
      },
    });

    const totalCount = parseInt(response.headers["x-total-count"], 10);
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

    // Cache the result
    notesCache.set(page, response.data, totalPages);

    return { notes: response.data, totalPages };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { notes: [], totalPages: 1 };
  }
};

export const preloadNotes = async (
  currentPage: number,
  totalPages: number
): Promise<void> => {
  const pagesToLoad = notesCache.preloadPages(currentPage, totalPages);

  if (pagesToLoad.length === 0) {
    return; // No logging needed when no pages to load
  }

  console.log(`Background loading pages: ${pagesToLoad.join(", ")}`);

  // Load pages in background
  const promises = pagesToLoad.map(async (page) => {
    try {
      const response = await axios.get<Note[]>(API_URL, {
        params: {
          _page: page,
          _per_page: POSTS_PER_PAGE,
        },
      });

      const totalCount = parseInt(response.headers["x-total-count"], 10);
      const calculatedTotalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
      notesCache.set(page, response.data, calculatedTotalPages);
    } catch (error) {
      console.error(`Error preloading page ${page}:`, error);
    }
  });

  await Promise.all(promises);
};

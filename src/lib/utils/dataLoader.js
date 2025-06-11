// src/utils/dataLoader.js
import bookData from '../assets/data/book.json';
import chantData from '../assets/data/chant.json';
import zoneData from '../assets/data/zones.json';

// Cache for loaded data
const dataCache = {
  book: null,
  chant: null,
  zones: null
};

// Load book data
export const loadBookData = async () => {
  if (dataCache.book) return dataCache.book;
  
  try {
    // In a real app, this might be a fetch call
    dataCache.book = bookData;
    return dataCache.book;
  } catch (error) {
    console.error('Error loading book data:', error);
    return null;
  }
};

// Load chant data
export const loadChantData = async () => {
  if (dataCache.chant) return dataCache.chant;
  
  try {
    dataCache.chant = chantData;
    return dataCache.chant;
  } catch (error) {
    console.error('Error loading chant data:', error);
    return null;
  }
};

// Load zone data
export const loadZoneData = async () => {
  if (dataCache.zones) return dataCache.zones;
  
  try {
    dataCache.zones = zoneData;
    return dataCache.zones;
  } catch (error) {
    console.error('Error loading zone data:', error);
    return null;
  }
};
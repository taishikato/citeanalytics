"use server";

export async function fetchUrl(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, error: "Failed to fetch data" };
  }
}

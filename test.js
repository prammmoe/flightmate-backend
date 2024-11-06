async function getData() {
  const url = "https://57a7-170-64-236-229.ngrok-free.app/dummy";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Rubens bodok");
    }

    console.log(response);

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

getData();

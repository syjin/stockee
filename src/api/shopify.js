const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/get-products`);
    console.log('Response Status:', response.status);
    const text = await response.text(); // 응답을 문자열로 변환해 출력
    console.log('Response Text:', text);
    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function updateInventory(inventoryLevelId, quantity) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/update-inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventoryLevelId, quantity }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

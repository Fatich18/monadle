export function simulateStake(amount: number): { success: boolean; reward: number } {
  if (amount <= 0) {
    return { success: false, reward: 0 };
  }

  // Örnek stake oranı: %30 kazanç
  const rewardRate = 0.3;
  const reward = amount * rewardRate;

  return {
    success: true,
    reward: parseFloat(reward.toFixed(2)),
  };
}

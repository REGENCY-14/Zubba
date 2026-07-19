import { api } from "../api/axios";

class PaymentPollingService {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  startPolling(
    reference: string,
    onSuccess: () => void,
    onFailure: (error: string) => void,
    onTimeout?: () => void
  ) {
    let attempts = 0;
    const maxAttempts = 40; // ~2 minutes at 3s intervals

    if (this.intervals.has(reference)) {
      this.stopPolling(reference);
    }

    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await api.get(`/payments/status/${reference}`);
        const { status } = response.data.data;

        if (status === 'success') {
          this.stopPolling(reference);
          onSuccess();
        } else if (status === 'failed') {
          this.stopPolling(reference);
          onFailure('Payment failed. Please try again.');
        } else if (attempts >= maxAttempts) {
          this.stopPolling(reference);
          if (onTimeout) onTimeout();
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (attempts >= maxAttempts) {
          this.stopPolling(reference);
          if (onTimeout) onTimeout();
        }
      }
    }, 3000);

    this.intervals.set(reference, interval);
  }

  stopPolling(reference: string) {
    const interval = this.intervals.get(reference);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(reference);
    }
  }

  stopAllPolling() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}

export default new PaymentPollingService();
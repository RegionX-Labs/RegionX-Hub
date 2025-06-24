'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import styles from './HelpCenterModal.module.scss';
import ReactMarkdown from 'react-markdown';

interface HelpPage {
  text: string;
  images?: string[];
}

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
}

const helpContent: Record<string, HelpPage[]> = {
  Overview: [
    {
      text: `**Welcome to the Overview Dashboard**

This view provides a high-level summary of your parachain’s Coretime activity. It's designed to give you immediate insight into your current status and renewal needs, including:

- Which cores are renewable this cycle
- The cost efficiency of renewal vs. new purchases
- Current auction pricing trends
- A history of purchases and actions

Use this dashboard to monitor, manage, and plan your Coretime usage effectively.`,
      images: ['/help/Overview.png', '/help/Overview2.png', '/help/Overview3.png'],
    },
    {
      text: `**Renewable Cores Panel**

This section lists all cores that are eligible for renewal during the current sale cycle. Each item includes:

- Para ID and its identicon
- A "Renew Now" button for direct renewal
- Time remaining until the renewal window closes
- The renewal cost in real time

If all renewable cores have already been renewed, a confirmation message is displayed.  
This ensures you never miss a deadline or double-check unnecessarily.

💡 Tip: Renew during the **interlude phase** to avoid losing priority. Renewals submitted late are not guaranteed to be processed in time.`,
      images: ['/help/RenewTutorial.png', '/help/RenewTutorial2.png'],
    },
    {
      text: `**Renewal vs New Core Price Comparison**

This section helps you decide whether to renew a core or purchase a new one based on current pricing:

- Shows the **current auction price** for new cores
- Shows the **calculated renewal price** for your existing cores
- Highlights if renewal is cheaper, equal, or more expensive

If renewing is less efficient, a warning is shown so you can make the best decision financially.

💡 Tip: Prices can shift quickly. Use this comparison to plan ahead or time your renewals strategically.`,
      images: ['/help/CoreComparison.png', '/help/CoreComparison2.png'],
    },
    {
      text: `**Auction Phase Status**

This widget displays the current auction phase and time progress for the ongoing sale cycle.

Phases:
- **Leadin**: Core prices decrease block-by-block.
- **Fixed Price**: Price is locked; only renewals and late buys happen.
- **Interlude**: Window to submit renewals before the next cycle.

The visual ring shows:
- Progress through the current phase
- When the next phase begins

💡 Tip: Use this to time renewals or new purchases — especially if you're targeting optimal pricing in Leadin or submitting during Interlude.`,
      images: ['/help/AuctionPhaseStatus.png', '/help/AuctionPhaseStatus2.png'],
    },
    {
      text: `**Dutch Auction Chart**

**Dutch Auction Chart**

This interactive graph visualizes how core prices evolve over time within the Dutch auction cycle.

- **Blue curve**: historical or simulated pricing as blocks progress.
- **Green marker**: current block and active core price.
- **Y-axis**: price in DOT.
- **X-axis**: block timeline from start to end of the sale cycle.

The auction begins with a high initial price that decreases linearly over the **Leadin** phase. Once the **Fixed Price** phase begins, the price stops decreasing and remains constant. During the **Interlude**, new purchases are no longer accepted, but renewals can still be submitted.

Use this chart to:
- Identify ideal entry points for core purchases.
- Predict when your target price may be reached.
- Understand historical buying behavior from previous cycles.

💡 Tip: Many buyers place bulk orders once prices hit a psychological threshold. If you're waiting too long, you may miss the purchase window entirely — especially in high-demand cycles.
`,
      images: [
        '/help/DutchAuctionChart2.png',
        '/help/DutchAuctionChart3.png',
        '/help/DutchAuctionChart4.png',
      ],
    },
    {
      text: `**Latest Purchase History**

This table lists all recent coretime purchases in the current or recent cycles. Each row includes:

- Para ID
- Buyer address
- Price paid
- Type of purchase (e.g., Renewal, New, Bulk)
- Timestamp

Click through pages using the pagination at the bottom.

💡 Tip: Use this data to spot patterns, such as bulk buys or aggressive renewals, and adjust your strategy accordingly.`,
      images: ['/help/PurchaseHistoryTable.png'],
    },
  ],
  'Deploying a new project': [
    { text: 'Step 1: Select and purchase cores from the Dutch Auction.' },
    { text: 'Step 2: Wait for your parachain to be scheduled after successful purchase.' },
    { text: 'Step 3: Launch your parachain once ready.' },
  ],
  'Managing Existing Project': [
    { text: 'Restore a core by selecting your Para ID and clicking "Renew".' },
    { text: 'You can compare renewal pricing and interlude timing.' },
    { text: 'Ensure your renewal is submitted before the interlude ends.' },
  ],
};

export default function HelpCenterModal({ isOpen, onClose, selected }: HelpCenterModalProps) {
  const [page, setPage] = useState(0);
  const content = helpContent[selected] || [{ text: 'No help content available.' }];

  useEffect(() => {
    if (isOpen) {
      setPage(0);
    }
  }, [isOpen, selected]);

  const next = () => setPage((p) => (p + 1) % content.length);
  const prev = () => setPage((p) => (p - 1 + content.length) % content.length);

  if (!isOpen) return null;

  const current = content[page];

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Help Center</h2>
          <X size={20} className={styles.closeIcon} onClick={onClose} />
        </div>

        <div className={styles.helpBody}>
          <div className={styles.text}>
            <ReactMarkdown>{current.text}</ReactMarkdown>
          </div>

          <div className={styles.images}>
            {current.images?.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Help Step ${page + 1} - Image ${index + 1}`}
                className={styles.helpImage}
              />
            ))}
          </div>
        </div>

        <div className={styles.pagination}>
          <button onClick={prev} disabled={content.length <= 1}>
            Previous
          </button>
          <span>
            {page + 1} / {content.length}
          </span>
          <button onClick={next} disabled={content.length <= 1}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

---

title:  "Serverless WebSockets: A Misnomer?"
subtitle: "Why your real-time chat app might not belong on serverless"
date: 2025-01-29

---

If you've ever tried to build a real-time application (chat, notifications, live updates) on serverless platforms like AWS Lambda, Vercel, or Netlify, you've probably wondered: *"Can I use WebSockets here?"*

The marketing says yes. The architecture says... it's complicated.

I spent the last few months building the same, very simple chat application four different ways and stress testing each implementation. Just thought that those results are worth sharing.

## TL;DR - The Key Findings

- **"Serverless WebSockets" aren't actually serverless** - they all require stateful, always-on infrastructure
- **AWS Lambda**: 180× slower cold starts, 2% connection failure rate at 100 users
- **Vercel + Pusher**: Cold starts ranging from 362ms to **23.4 seconds** (64× variance)
- **Traditional EC2 server**: Faster, cheaper (\$7.50/month), 100% reliable
- **The verdict**: For production real-time apps, skip the serverless solutions

---

## The Fundamental Problem

WebSockets and serverless functions are architecturally incompatible:

### What WebSockets Need:
- Long-lived processes (hours or days)
- Persistent connections in memory
- Ability to send messages anytime
- Sub-50ms latency

### What Serverless Provides:
- Short-lived functions (seconds to minutes)
- Stateless execution
- Event-driven invocation only
- Pay-per-execution billing

**You can't hold a WebSocket connection open in a Lambda function that lives for 15 minutes max and costs money for idle time.**

So what do cloud providers do? They create workarounds. I'll list down 2 workarounds that I found different CSPs are doing plus the traditional way.

---

## The Three Workarounds (And How They Actually Work)

### 1. AWS Lambda + API Gateway

**The "integrated" approach**

AWS gives you API Gateway WebSockets, which maintains the actual persistent connections, while Lambda handles your business logic.

**How it works:**
```
Client → API Gateway (holds WebSocket) → Triggers Lambda
Lambda → DynamoDB (stores connection IDs)
Lambda → API Gateway Management API → Client
```

**What they don't tell you:**
- API Gateway isn't serverless—it runs 24/7 and charges per connection-minute
- Every message requires 3 network hops
- You're managing 3+ services: API Gateway, Lambda, DynamoDB, IAM permissions

**The result:** Architectural complexity that makes things a lot more complicated.

---

### 2. Vercel (also Netlify) Functions + Pusher

**The "delegated" approach**

Vercel doesn't support WebSockets at all. Their official docs tell you to use Pusher (a third-party service). Netlify also uses a delegated approach where they recommend using Ably. 

**How it works:**
```
Client → Vercel Function (HTTP POST) → Pusher API
Pusher → Client (via WebSocket)
```

**What they don't tell you:**
- You're paying two companies (Vercel + Pusher)
- Free tier has undocumented rate limits that silently drop messages
- Vendor lock-in to Pusher's proprietary APIs

**The result:** Simple to set up, catastrophic to scale.

---

### 3. Traditional Node.js Server on EC2

**The "boring" approach**

A simple Node.js server with the `ws` library running on a \$7.50/month EC2 t3.micro instance.

**How it works:**
```
Client ←→ Server (that's it)
```

**What they do tell you:**
- You have to manage a server (security updates, monitoring)
- No automatic scaling
- Fixed monthly cost

**The result:** Simple, fast, reliable, cheap.

---

## The Performance Tests

I built the exact same real-time chat app four times and load-tested each with 10, 50, and 100 concurrent users. Here's what happened:

### Cold Start Horror Show

**First message latency (10 connections):**

| Platform | Cold Start | vs. EC2 |
|----------|-----------|---------|
| EC2 | 6.84ms | 1× (baseline) |
| Lambda | 2,133ms | **180× slower** |
| Vercel+Pusher (best) | 362ms | 27× slower |
| Vercel+Pusher (worst) | **23,399ms** | **3,420× slower** |

As you can see, in the worst case, Vercel + Pusher took **23.4 seconds** to deliver the first message which is unacceptable in real-time application.

### Message Latency (Average Round-Trip)

**10 concurrent connections:**

| Platform | Avg Latency | vs. EC2 |
|----------|-------------|---------|
| EC2 | 24ms | 1× |
| Lambda | 1,155ms | **47× slower** |
| Vercel+Pusher | 161ms - 2,561ms | **6.6-105× slower** |

### Failure rate
**100 concurrent connections, 10,000 messages:**

| Platform | Connection Success | Messages Delivered | Notes |
|----------|-------------------|-------------------|-------|
| EC2 | 100% | 100% | Zero failures |
| Lambda | 98% | 98% | 2% failed with HTTP 500 |
| Vercel+Pusher | 100% | **9-11%** | 90% silently dropped! |

Let me emphasize that Vercel + Pusher result: **All connections succeeded, but 9 out of 10 messages were silently dropped with no error messages. This is due to the limitations of free tier. I believe that in the Paid tiers, this won't be an issue**

---

## The Cost Reality Check

Let's price out a realistic scenario: **100 users connected for 8 hours/day, sending 50 messages each.**

| Platform | Monthly Cost | Performance | Reliability |
|----------|-------------|-------------|-------------|
| **EC2 t3.micro** | **\$7.50** | Fast | 100% |
| **Lambda + API Gateway** | \$5.64-8.64 | 1.8× slower | 98% |
| **Vercel + Pusher (free)** | \$0* | Unpredictable | 10%** |
| **Vercel + Pusher (paid)** | \$49+ | Good | 100% |
| **Netlify + Ably** | \$29+ | Good | 100% |

\* Only works for tiny scale  
\** 90% message loss on free tier

**The "serverless" promise of lower costs evaporates.** Lambda costs almost as much as EC2 while performing worse. Third-party services cost 4-53× more.


---

## When Should You Actually Use Each Approach?

### Use Traditional Servers (EC2, VPS, Railway, Fly.io) When:
- Building any production real-time application  
- Latency matters (gaming, trading, live collaboration)  
- Reliability is critical  
- You want predictable costs  
- You value simplicity  

**This is usually what developers want.**

### Use AWS Lambda + API Gateway when:
- Traffic is extremely spiky (Black Friday-style)  
- You can tolerate 200ms+ latency  
- 2-5% connection failures are acceptable  
- Your team is already all-in on AWS  

**This is rarely the case. But who knows? Maybe you're hosting an app that sees sudden spikes. Then maybe this could be for you**

### Use Vercel/Netlify + Pusher/Ably when:
- Prototyping only (use paid tiers for production)  
- You're okay with 4-53× higher costs  
- Vendor lock-in is acceptable  
- You have budget for enterprise support  

**In my opinion, this is not recommended at all. Only do it for experimental or educational purposes.**

---

## The Marketing vs. Reality Gap

Cloud providers market "serverless WebSockets" as:
- Infinitely scalable
- Pay only for what you use
- Zero infrastructure management
- Better than traditional servers

**The reality:**
- Requires stateful infrastructure (API Gateway, Pusher, Ably)
- Costs as much or more than traditional servers
- Manages 2-3× more services
- Slower, less reliable, more complex

The term "serverless WebSockets" is fundamentally misleading. You're not eliminating servers—you're just using someone else's servers and calling them via HTTP.

---

## The Bottom Line

After building and testing the same application four different ways, the winner is clear:

**Traditional WebSocket servers are faster, cheaper, more reliable, and simpler than any "serverless" alternative.**

The serverless revolution is real and valuable - for stateless HTTP APIs, background jobs, and data processing. But for real-time, stateful, persistent-connection protocols like WebSockets, serverless is a square peg in a round hole.

Don't let marketing hype drive your architecture decisions. Sometimes the boring solution is boring because it just works!

---

## Additional Resources

- **Full Research Paper**: [Link to PDF](/Serverless_websockets.pdf)

## Questions or Feedback?

Found an error? Want to discuss these results? Reach out:
- Email: karuns@usi.ch
- GitHub: [Sundaresan Karunakaran](https://github.com/Sundaresan-Karunakaran)

---

*This blog post is based on my research paper "Serverless WebSockets: A Misnomer?" conducted at USI Lugano. All tests were performed using free tier offerings across all platforms to evaluate baseline performance accessible to developers without upfront financial commitment.*

*Last updated: January 2026*
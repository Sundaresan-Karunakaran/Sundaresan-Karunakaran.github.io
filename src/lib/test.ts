import { parsePost } from './parsePost'

const raw = `
---
title: "Hello World"
subtitle: "Test Subtitle"
date: 2026-01-29
---

This is a test blog post!
`

console.log(parsePost(raw))

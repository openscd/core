# 2. Core, Badrock and Distribution as base layers of OpenSCD

Date: 2025-04-10

## Status

Accepted

## Context

As a community we would like to have a stable and UI technology agnostic API to use in our plugins and build on top of it.
Current, the name "OpenSCD Core" can lead to misunderstandings. It not only contains and API but it provides a ready-to-go UI, the plugin loading mechanism and other things.
However, we still need an API and specification, and a a quick way to create and configure a new distribution of OpenSCD.

## Decision

We will split up OpenSCD Core by its focus and target groups:

```txt
┌──────────────────────┐
│     Distribution     │
└──┬────────────────┬──┘
   │    Bedrock     │   
   └──┬──────────┬──┘   
      │   Core   │      
      └──────────┘      
```

1. Distribution: It is for distributors who want to create a new instance of OpenSCD and tailor it for specific needs through possible configurations.

2. Bedrock: You can use a given Bedrock to build your own OpenSCD distribution. It is a Web Component that you can easily deploy and configure. If you need more or different functionality that you cannot achive by configuring a Bedrock, you can create your own.

3. Core: it is mainly for plugin-, bedrock- and distribution developers in the ecosystem to help each other create plugins that are compatible with every distributions and also to create distributions that are compatible with most of the plugins.

## Consequences

- With the new, simpler Core we can agree on the common API on the code level
- Other components and layers are not bound to a specific UI technology
- We aggre on what belongs into the core
- We have to create a new bedrock with the extracted core functionality
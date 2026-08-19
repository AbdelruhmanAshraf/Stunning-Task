"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Sparkles,
  Maximize2,
  Minimize2,
  Check,
  Zap,
  Layers,
  Code2,
} from "lucide-react";
import { GeneratedFile } from "@/lib/ai";

interface LiveAppPreviewProps {
  userPrompt: string;
  selectedIntegrations: string[];
  files: GeneratedFile[];
  liveHtml?: string;
  isStreaming?: boolean;
}

export function LiveAppPreview({
  userPrompt,
  selectedIntegrations,
  files,
  liveHtml = "",
  isStreaming = false,
}: LiveAppPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // When liveHtml changes (stream finishes), bump iframe key to force re-render
  const prevHtmlRef = useRef("");
  useEffect(() => {
    if (liveHtml && liveHtml !== prevHtmlRef.current && !isStreaming) {
      prevHtmlRef.current = liveHtml;
      setIframeKey((k) => k + 1);
    }
  }, [liveHtml, isStreaming]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIframeKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleOpenNewTab = () => {
    const htmlContent = liveHtml || generateAppHtml(userPrompt, selectedIntegrations, files);
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  // Use liveHtml from Gemini if available, otherwise fall back to template
  const previewHtml = useMemo(() => {
    if (liveHtml && liveHtml.length > 100) return liveHtml;
    return generateAppHtml(userPrompt, selectedIntegrations, files);
  }, [liveHtml, userPrompt, selectedIntegrations, files]);

  return (
    <div
      className={`flex flex-col h-full bg-slate-900/90 dark:bg-[#070913] rounded-2xl border border-slate-800/80 dark:border-white/10 overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? "fixed inset-4 z-50 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)]" : ""
      }`}
    >
      {/* Top Browser Window Chrome / Navigation Bar */}
      <div className="h-11 bg-slate-950/80 border-b border-slate-800/70 px-4 flex items-center justify-between shrink-0 select-none">
        {/* Left: Window Dots + Simulated URL */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Simulated Live URL Address Bar */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-500">https://</span>
            <span className="text-slate-200">
              preview-{encodeURIComponent(userPrompt.slice(0, 15).toLowerCase().replace(/[^a-z0-9]/g, "-")) || "app"}.stunning.dev
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              device === "desktop"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              device === "tablet"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              device === "mobile"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Mobile</span>
          </button>
        </div>

        {/* Right: Actions (Refresh, New Tab, Fullscreen) */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition ${
              isRefreshing ? "animate-spin text-violet-400" : ""
            }`}
            title="Reload Preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleOpenNewTab}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title="Open Live Preview in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Preview Frame Container */}
      <div className="flex-1 bg-slate-950/60 p-3 sm:p-4 overflow-auto flex items-center justify-center relative">
        <div
          className={`h-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-slate-800/50 flex flex-col relative ${
            device === "desktop"
              ? "w-full"
              : device === "tablet"
              ? "w-[768px] max-w-full"
              : "w-[375px] max-w-full"
          }`}
        >
          {/* Streaming Skeleton Overlay — shown while Gemini is thinking */}
          {isStreaming && (
            <div className="absolute inset-0 z-10 bg-[#0a0b14] flex flex-col items-center justify-center gap-6 px-8">
              {/* Animated Logo */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-2xl bg-violet-600/20 border border-violet-500/40 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-violet-400 animate-pulse" />
                </div>
                <div className="absolute -inset-2 rounded-3xl border border-violet-500/20 animate-ping" style={{ animationDuration: "2s" }} />
              </div>

              {/* Status text */}
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-white">Stunning AI is building your app...</p>
                <p className="text-xs text-slate-400 max-w-xs">Designing UI, writing logic, and injecting integrations in real-time</p>
              </div>

              {/* Animated thinking dots */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>

              {/* Skeleton bars */}
              <div className="w-full max-w-sm space-y-3">
                <div className="h-8 rounded-xl bg-white/5 animate-pulse" style={{ width: "70%" }} />
                <div className="h-4 rounded-lg bg-white/5 animate-pulse" style={{ width: "90%", animationDelay: "0.1s" }} />
                <div className="h-4 rounded-lg bg-white/5 animate-pulse" style={{ width: "60%", animationDelay: "0.2s" }} />
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="h-20 rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: "0.1s" }} />
                  <div className="h-20 rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: "0.25s" }} />
                  <div className="h-20 rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}

          <iframe
            key={iframeKey}
            ref={iframeRef}
            srcDoc={previewHtml}
            title="Interactive App Preview"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Intelligent Lovable-style Interactive Application HTML Generator
 * Synthesizes a responsive, interactive web application based on the user's prompt and selected integrations.
 */
function generateAppHtml(prompt: string, integrations: string[], files: GeneratedFile[]): string {
  const p = (prompt || "").toLowerCase();

  // 1. Check if prompt is a CHESS / BOARD GAME
  if (p.includes("chess") || p.includes("board game") || p.includes("game")) {
    return generateChessGameHtml(prompt);
  }

  // 2. Check if prompt is an E-COMMERCE / STOREFRONT
  if (p.includes("store") || p.includes("shop") || p.includes("ecommerce") || p.includes("product") || integrations.includes("shopify")) {
    return generateEcommerceHtml(prompt, integrations);
  }

  // 3. Check if prompt is a SAAS BILLING / SUBSCRIPTION DASHBOARD
  if (p.includes("billing") || p.includes("saas") || p.includes("subscription") || p.includes("invoice") || integrations.includes("stripe")) {
    return generateSaasBillingHtml(prompt, integrations);
  }

  // 4. Check if prompt is a TASK / KANBAN / PROJECT MANAGER
  if (p.includes("task") || p.includes("kanban") || p.includes("project") || p.includes("todo") || p.includes("board")) {
    return generateKanbanHtml(prompt, integrations);
  }

  // 5. Default: Modern Multi-Service Dashboard & App
  return generateCustomAppHtml(prompt, integrations);
}

/* ========================================================================= */
/* 1. INTERACTIVE CHESS GAME GENERATOR (Playable in Preview!)                */
/* ========================================================================= */
function generateChessGameHtml(prompt: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Chess Game</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    .chess-tile-light { background-color: #f0d9b5; }
    .chess-tile-dark { background-color: #b58863; }
    .chess-tile-selected { background-color: #7fc97f !important; }
    .chess-tile-highlight { box-shadow: inset 0 0 0 4px #f59e0b; }
    .piece { font-size: 2.2rem; cursor: pointer; user-select: none; transition: transform 0.15s ease; }
    .piece:hover { transform: scale(1.12); }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
  <!-- Header -->
  <header class="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg">
        <i class="fa-solid fa-chess-knight"></i>
      </div>
      <div>
        <h1 class="font-bold text-sm text-white">Stunning Chess Master</h1>
        <p class="text-[11px] text-slate-400 font-mono">Interactive Web Player</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div id="turn-badge" class="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span>White's Turn</span>
      </div>
      <button onclick="resetGame()" class="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition flex items-center gap-1.5">
        <i class="fa-solid fa-rotate-right"></i> Reset
      </button>
    </div>
  </header>

  <!-- Main Game Workspace -->
  <main class="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 max-w-6xl mx-auto w-full">
    <!-- Left: Chess Board -->
    <div class="flex flex-col items-center">
      <!-- Opponent Info -->
      <div class="w-full max-w-[440px] flex items-center justify-between pb-2 text-xs font-mono text-slate-400">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-robot text-violet-400"></i>
          <span>Black (AI Grandmaster)</span>
        </div>
        <span id="black-timer" class="font-bold text-slate-200">10:00</span>
      </div>

      <!-- 8x8 Board -->
      <div id="chessboard" class="w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] grid grid-cols-8 grid-rows-8 border-4 border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      </div>

      <!-- Player Info -->
      <div class="w-full max-w-[440px] flex items-center justify-between pt-2 text-xs font-mono text-slate-400">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-user text-emerald-400"></i>
          <span>White (You)</span>
        </div>
        <span id="white-timer" class="font-bold text-emerald-400">10:00</span>
      </div>
    </div>

    <!-- Right: Move Log & Stats -->
    <div class="w-full lg:w-80 flex flex-col gap-4">
      <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Live Match Stats</span>
          <span class="text-emerald-400 font-mono text-[10px]">Active</span>
        </h3>
        <div class="grid grid-cols-2 gap-2 text-center text-xs">
          <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
            <span class="text-slate-500 block text-[10px]">Moves Played</span>
            <span id="move-count" class="text-lg font-bold text-white">0</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
            <span class="text-slate-500 block text-[10px]">Advantage</span>
            <span class="text-lg font-bold text-violet-400">+0.0</span>
          </div>
        </div>
      </div>

      <!-- Move History -->
      <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex-1 flex flex-col min-h-[220px]">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Move History
        </h3>
        <div id="moves-list" class="flex-1 overflow-y-auto font-mono text-xs space-y-1.5 max-h-48 text-slate-300">
          <p class="text-slate-500 italic text-[11px]">Match started. Select a piece to move...</p>
        </div>
      </div>
    </div>
  </main>

  <script>
    // Initial Board Representation
    const INITIAL_BOARD = [
      ['♜','♞','♝','♛','♚','♝','♞','♜'],
      ['♟','♟','♟','♟','♟','♟','♟','♟'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['♙','♙','♙','♙','♙','♙','♙','♙'],
      ['♖','♘','♗','♕','♔','♗','♘','♖']
    ];

    let board = JSON.parse(JSON.stringify(INITIAL_BOARD));
    let selectedSquare = null;
    let turn = 'white';
    let moveCount = 0;

    function isWhitePiece(piece) {
      return ['♙','♖','♘','♗','♕','♔'].includes(piece);
    }
    function isBlackPiece(piece) {
      return ['♟','♜','♞','♝','♛','♚'].includes(piece);
    }

    function renderBoard() {
      const container = document.getElementById('chessboard');
      container.innerHTML = '';

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const tile = document.createElement('div');
          const isLight = (r + c) % 2 === 0;
          tile.className = \`flex items-center justify-center \${isLight ? 'chess-tile-light' : 'chess-tile-dark'}\`;
          tile.dataset.row = r;
          tile.dataset.col = c;

          if (selectedSquare && selectedSquare.row === r && selectedSquare.col === c) {
            tile.classList.add('chess-tile-selected');
          }

          const piece = board[r][c];
          if (piece) {
            const span = document.createElement('span');
            span.className = 'piece';
            span.textContent = piece;
            span.style.color = isWhitePiece(piece) ? '#ffffff' : '#111827';
            span.style.textShadow = isWhitePiece(piece) ? '0 2px 4px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.4)';
            tile.appendChild(span);
          }

          tile.addEventListener('click', () => handleSquareClick(r, c));
          container.appendChild(tile);
        }
      }
    }

    function handleSquareClick(r, c) {
      const piece = board[r][c];

      if (selectedSquare) {
        // If clicking same piece, deselect
        if (selectedSquare.row === r && selectedSquare.col === c) {
          selectedSquare = null;
          renderBoard();
          return;
        }

        // Move the piece
        const srcPiece = board[selectedSquare.row][selectedSquare.col];
        board[r][c] = srcPiece;
        board[selectedSquare.row][selectedSquare.col] = '';
        
        moveCount++;
        document.getElementById('move-count').textContent = moveCount;

        // Log move
        const fromCoord = String.fromCharCode(97 + selectedSquare.col) + (8 - selectedSquare.row);
        const toCoord = String.fromCharCode(97 + c) + (8 - r);
        logMove(srcPiece, fromCoord, toCoord);

        selectedSquare = null;
        turn = turn === 'white' ? 'black' : 'white';
        updateTurnBadge();
        renderBoard();

        // Trigger AI simulated response if black's turn
        if (turn === 'black') {
          setTimeout(makeAiMove, 600);
        }
      } else {
        if (piece) {
          if ((turn === 'white' && isWhitePiece(piece)) || (turn === 'black' && isBlackPiece(piece))) {
            selectedSquare = { row: r, col: c };
            renderBoard();
          }
        }
      }
    }

    function makeAiMove() {
      // Find all black pieces
      const blackPieces = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (isBlackPiece(board[r][c])) {
            blackPieces.push({ r, c, piece: board[r][c] });
          }
        }
      }

      if (blackPieces.length > 0) {
        const randomPiece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
        // Simple step forward or diagonal
        const newRow = Math.min(7, randomPiece.r + 1);
        const newCol = Math.max(0, Math.min(7, randomPiece.c + (Math.random() > 0.5 ? 1 : -1)));

        board[newRow][newCol] = randomPiece.piece;
        board[randomPiece.r][randomPiece.c] = '';

        moveCount++;
        document.getElementById('move-count').textContent = moveCount;
        const fromCoord = String.fromCharCode(97 + randomPiece.c) + (8 - randomPiece.r);
        const toCoord = String.fromCharCode(97 + newCol) + (8 - newRow);
        logMove(randomPiece.piece, fromCoord, toCoord);

        turn = 'white';
        updateTurnBadge();
        renderBoard();
      }
    }

    function logMove(piece, from, to) {
      const list = document.getElementById('moves-list');
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between py-1 border-b border-slate-900 text-slate-300';
      div.innerHTML = \`<span>Move #\${moveCount}: \${piece}</span><span class="text-violet-400 font-bold">\${from} → \${to}</span>\`;
      list.prepend(div);
    }

    function updateTurnBadge() {
      const badge = document.getElementById('turn-badge');
      if (turn === 'white') {
        badge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-2';
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span><span>White\\'s Turn</span>';
      } else {
        badge.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-2';
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span><span>Black (AI) Thinking...</span>';
      }
    }

    function resetGame() {
      board = JSON.parse(JSON.stringify(INITIAL_BOARD));
      selectedSquare = null;
      turn = 'white';
      moveCount = 0;
      document.getElementById('move-count').textContent = '0';
      document.getElementById('moves-list').innerHTML = '<p class="text-slate-500 italic text-[11px]">Match reset. Select a piece to move...</p>';
      updateTurnBadge();
      renderBoard();
    }

    // Initial render
    renderBoard();
  </script>
</body>
</html>`;
}

/* ========================================================================= */
/* 2. INTERACTIVE SAAS BILLING & STRIPE DASHBOARD GENERATOR                 */
/* ========================================================================= */
function generateSaasBillingHtml(prompt: string, integrations: string[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Subscription & Billing Hub</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#090a10] text-slate-100 min-h-screen flex flex-col font-sans">
  <!-- Navbar -->
  <nav class="border-b border-slate-800 bg-[#0d0f1a] px-6 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-md">
        <i class="fa-solid fa-credit-card"></i>
      </div>
      <div>
        <h1 class="font-bold text-sm text-white">VibeScale Billing Portal</h1>
        <p class="text-[11px] text-slate-400 font-mono">Stripe Connected (Sandbox)</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Stripe Live Mode
      </span>
      <button onclick="triggerSlackAlert()" class="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition flex items-center gap-1.5">
        <i class="fa-brands fa-slack"></i> Send Slack Alert
      </button>
    </div>
  </nav>

  <main class="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl bg-[#111322] border border-slate-800">
        <span class="text-xs text-slate-400">Monthly Recurring Revenue</span>
        <div class="text-2xl font-bold text-white mt-1">$14,850.00</div>
        <span class="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">↑ +18.4% this month</span>
      </div>
      <div class="p-4 rounded-2xl bg-[#111322] border border-slate-800">
        <span class="text-xs text-slate-400">Active Subscribers</span>
        <div class="text-2xl font-bold text-white mt-1">1,248</div>
        <span class="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">↑ +92 new users</span>
      </div>
      <div class="p-4 rounded-2xl bg-[#111322] border border-slate-800">
        <span class="text-xs text-slate-400">Churn Rate</span>
        <div class="text-2xl font-bold text-white mt-1">1.2%</div>
        <span class="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">↓ -0.4% healthy</span>
      </div>
      <div class="p-4 rounded-2xl bg-[#111322] border border-slate-800">
        <span class="text-xs text-slate-400">Avg. Revenue / User</span>
        <div class="text-2xl font-bold text-white mt-1">$48.50</div>
        <span class="text-[11px] text-violet-400 font-semibold mt-1 inline-block">Enterprise focus</span>
      </div>
    </div>

    <!-- Pricing Plans Matrix -->
    <div class="p-6 rounded-2xl bg-[#111322] border border-slate-800 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-white">Subscription Plans</h2>
          <p class="text-xs text-slate-400">Upgrade or adjust your current subscription tier</p>
        </div>
        <div class="flex items-center gap-2 bg-[#090a10] p-1 rounded-xl border border-slate-800 text-xs">
          <button id="btn-monthly" onclick="setBillingCycle('monthly')" class="px-3 py-1 rounded-lg bg-violet-600 text-white font-semibold">Monthly</button>
          <button id="btn-annual" onclick="setBillingCycle('annual')" class="px-3 py-1 rounded-lg text-slate-400 hover:text-white">Annual (Save 20%)</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Starter -->
        <div class="p-5 rounded-xl bg-[#15182a] border border-slate-800 hover:border-violet-500/50 transition flex flex-col justify-between">
          <div class="space-y-3">
            <h3 class="font-bold text-sm text-slate-200">Starter Vibe</h3>
            <div class="text-2xl font-extrabold text-white" id="price-starter">$29<span class="text-xs text-slate-400 font-normal">/mo</span></div>
            <p class="text-xs text-slate-400">Essential tools for indie builders and creators.</p>
            <ul class="text-xs text-slate-300 space-y-2 pt-2">
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>5 AI Deployments</li>
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Stripe & Shopify API</li>
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Community Support</li>
            </ul>
          </div>
          <button onclick="openCheckout('Starter', '$29')" class="mt-6 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition">Select Starter</button>
        </div>

        <!-- Pro (Featured) -->
        <div class="p-5 rounded-xl bg-gradient-to-b from-[#1e1a38] to-[#15182a] border-2 border-violet-500 shadow-xl flex flex-col justify-between relative">
          <span class="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider">Most Popular</span>
          <div class="space-y-3">
            <h3 class="font-bold text-sm text-violet-300">Pro Developer</h3>
            <div class="text-2xl font-extrabold text-white" id="price-pro">$79<span class="text-xs text-slate-400 font-normal">/mo</span></div>
            <p class="text-xs text-slate-400">Complete AI code generation and automated webhooks.</p>
            <ul class="text-xs text-slate-300 space-y-2 pt-2">
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Unlimited AI Sandboxes</li>
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>All 5+ Injected Integrations</li>
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Real-time Slack Webhooks</li>
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Priority Support</li>
            </ul>
          </div>
          <button onclick="openCheckout('Pro Developer', '$79')" class="mt-6 w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow-lg transition">Upgrade to Pro</button>
        </div>

        <!-- Enterprise -->
        <div class="p-5 rounded-xl bg-[#15182a] border border-slate-800 hover:border-violet-500/50 transition flex flex-col justify-between">
          <div class="space-y-3">
            <h3 class="font-bold text-sm text-slate-200">Enterprise</h3>
            <div class="text-2xl font-extrabold text-white" id="price-enterprise">$249<span class="text-xs text-slate-400 font-normal">/mo</span></div>
            <p class="text-xs text-slate-400">Dedicated sandboxes, custom SLAs, and custom LLMs.</p>
            <ul class="text-xs text-slate-300 space-y-2 pt-2">
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Dedicated VM Clusters</li>
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>Custom OAuth Handshakes</li>
              <li><i class="fa-solid fa-check text-emerald-400 mr-2"></i>24/7 Phone & Slack SLA</li>
            </ul>
          </div>
          <button onclick="openCheckout('Enterprise', '$249')" class="mt-6 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition">Contact Sales</button>
        </div>
      </div>
    </div>
  </main>

  <!-- Simulated Checkout Modal -->
  <div id="checkout-modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm hidden items-center justify-center p-4 z-50">
    <div class="bg-[#121424] border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="fa-brands fa-stripe text-violet-400 text-lg"></i>
          Complete Subscription
        </h3>
        <button onclick="closeCheckout()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-3 bg-[#090a10] rounded-xl border border-slate-800 text-xs space-y-1">
        <div class="flex justify-between text-slate-400">
          <span>Selected Plan:</span>
          <span id="modal-plan" class="font-bold text-white">Pro Developer</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>Amount:</span>
          <span id="modal-amount" class="font-bold text-emerald-400">$79.00 / month</span>
        </div>
      </div>
      <div class="space-y-2 text-xs">
        <label class="text-slate-400 block">Card Details (Sandbox)</label>
        <input type="text" value="•••• •••• •••• 4242" class="w-full bg-[#090a10] border border-slate-800 rounded-lg p-2.5 text-white font-mono" readonly>
      </div>
      <button onclick="confirmPayment()" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition">
        Pay & Activate License
      </button>
    </div>
  </div>

  <script>
    function setBillingCycle(cycle) {
      if (cycle === 'annual') {
        document.getElementById('btn-annual').className = 'px-3 py-1 rounded-lg bg-violet-600 text-white font-semibold';
        document.getElementById('btn-monthly').className = 'px-3 py-1 rounded-lg text-slate-400 hover:text-white';
        document.getElementById('price-starter').innerHTML = '$23<span class="text-xs text-slate-400 font-normal">/mo (billed yearly)</span>';
        document.getElementById('price-pro').innerHTML = '$63<span class="text-xs text-slate-400 font-normal">/mo (billed yearly)</span>';
        document.getElementById('price-enterprise').innerHTML = '$199<span class="text-xs text-slate-400 font-normal">/mo (billed yearly)</span>';
      } else {
        document.getElementById('btn-monthly').className = 'px-3 py-1 rounded-lg bg-violet-600 text-white font-semibold';
        document.getElementById('btn-annual').className = 'px-3 py-1 rounded-lg text-slate-400 hover:text-white';
        document.getElementById('price-starter').innerHTML = '$29<span class="text-xs text-slate-400 font-normal">/mo</span>';
        document.getElementById('price-pro').innerHTML = '$79<span class="text-xs text-slate-400 font-normal">/mo</span>';
        document.getElementById('price-enterprise').innerHTML = '$249<span class="text-xs text-slate-400 font-normal">/mo</span>';
      }
    }

    function openCheckout(plan, amount) {
      document.getElementById('modal-plan').textContent = plan;
      document.getElementById('modal-amount').textContent = amount + ' / month';
      const modal = document.getElementById('checkout-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeCheckout() {
      const modal = document.getElementById('checkout-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function confirmPayment() {
      alert('🎉 Stripe Sandbox Payment Successful! Your subscription is now active.');
      closeCheckout();
    }

    function triggerSlackAlert() {
      alert('🔔 Slack Notification Dispatched: "New subscriber joined via Stripe Portal!"');
    }
  </script>
</body>
</html>`;
}

/* ========================================================================= */
/* 3. INTERACTIVE E-COMMERCE STOREFRONT (Shopify & Stripe)                  */
/* ========================================================================= */
function generateEcommerceHtml(prompt: string, integrations: string[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern E-Commerce Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
  <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white">
        <i class="fa-solid fa-bag-shopping"></i>
      </div>
      <span class="font-bold text-base text-white">LuxeVibe Store</span>
    </div>
    <div class="flex items-center gap-4">
      <button onclick="toggleCart()" class="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
        <i class="fa-solid fa-cart-shopping text-slate-200"></i>
        <span id="cart-badge" class="absolute -top-1.5 -right-1.5 bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
      </button>
    </div>
  </header>

  <main class="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-white">Featured Catalog</h2>
        <p class="text-xs text-slate-400">Shopify Product API Integration Ready</p>
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-semibold">All</button>
        <button class="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs">Electronics</button>
        <button class="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs">Apparel</button>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
        <div class="h-44 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-4xl">
          <i class="fa-solid fa-headphones"></i>
        </div>
        <div>
          <h3 class="font-bold text-sm text-white">Wireless Noise-Canceling Headphones</h3>
          <p class="text-xs text-slate-400 mt-1">Studio grade sound with 40h battery life.</p>
        </div>
        <div class="flex items-center justify-between pt-2">
          <span class="text-base font-bold text-emerald-400">$199.99</span>
          <button onclick="addToCart('Wireless Headphones', 199.99)" class="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition flex items-center gap-1">
            <i class="fa-solid fa-plus"></i> Add to Cart
          </button>
        </div>
      </div>

      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
        <div class="h-44 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-4xl">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div>
          <h3 class="font-bold text-sm text-white">Pro Smartwatch Ultra</h3>
          <p class="text-xs text-slate-400 mt-1">Titanium case, GPS, health telemetry sensors.</p>
        </div>
        <div class="flex items-center justify-between pt-2">
          <span class="text-base font-bold text-emerald-400">$299.00</span>
          <button onclick="addToCart('Pro Smartwatch', 299.00)" class="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition flex items-center gap-1">
            <i class="fa-solid fa-plus"></i> Add to Cart
          </button>
        </div>
      </div>

      <div class="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
        <div class="h-44 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-4xl">
          <i class="fa-solid fa-laptop"></i>
        </div>
        <div>
          <h3 class="font-bold text-sm text-white">Ultra-Slim Mechanical Keyboard</h3>
          <p class="text-xs text-slate-400 mt-1">RGB backlight, hot-swappable tactile switches.</p>
        </div>
        <div class="flex items-center justify-between pt-2">
          <span class="text-base font-bold text-emerald-400">$129.50</span>
          <button onclick="addToCart('Mechanical Keyboard', 129.50)" class="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition flex items-center gap-1">
            <i class="fa-solid fa-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  </main>

  <script>
    let cart = [];
    function addToCart(title, price) {
      cart.push({ title, price });
      document.getElementById('cart-badge').textContent = cart.length;
      alert(\`🛒 Added "\${title}" to your cart!\`);
    }
    function toggleCart() {
      if (cart.length === 0) {
        alert('Your shopping cart is currently empty.');
        return;
      }
      const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
      alert(\`🛍️ Shopping Cart: \${cart.length} items\\nTotal: $\${total}\\nProceeding to Stripe/Shopify Checkout...\`);
    }
  </script>
</body>
</html>`;
}

/* ========================================================================= */
/* 4. INTERACTIVE KANBAN BOARD (Tasks & Projects)                            */
/* ========================================================================= */
function generateKanbanHtml(prompt: string, integrations: string[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kanban Project Board</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#0b0c16] text-slate-100 min-h-screen flex flex-col font-sans">
  <header class="bg-[#101222] border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white">
        <i class="fa-solid fa-list-check"></i>
      </div>
      <h1 class="font-bold text-sm text-white">VibeFlow Sprint Board</h1>
    </div>
    <button onclick="addNewTask()" class="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition flex items-center gap-1.5">
      <i class="fa-solid fa-plus"></i> New Task
    </button>
  </header>

  <main class="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
    <!-- Backlog -->
    <div class="bg-[#121426] p-4 rounded-2xl border border-slate-800 flex flex-col space-y-3">
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Backlog (2)</span>
        <span class="w-2 h-2 rounded-full bg-slate-500"></span>
      </div>
      <div class="space-y-2.5 flex-1">
        <div class="p-3 bg-[#181b33] rounded-xl border border-slate-800/80 space-y-2">
          <span class="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">Design</span>
          <h4 class="text-xs font-semibold text-white">Design Landing Page Hero</h4>
          <p class="text-[11px] text-slate-400">Implement glassmorphism aesthetics and purple vibe glow.</p>
        </div>
        <div class="p-3 bg-[#181b33] rounded-xl border border-slate-800/80 space-y-2">
          <span class="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Auth</span>
          <h4 class="text-xs font-semibold text-white">OAuth Setup with Google & GitHub</h4>
        </div>
      </div>
    </div>

    <!-- In Progress -->
    <div class="bg-[#121426] p-4 rounded-2xl border border-slate-800 flex flex-col space-y-3">
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-400">In Progress (1)</span>
        <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
      </div>
      <div class="space-y-2.5 flex-1">
        <div class="p-3 bg-[#181b33] rounded-xl border border-amber-500/30 space-y-2">
          <span class="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Backend</span>
          <h4 class="text-xs font-semibold text-white">Stripe Webhook Listener</h4>
          <p class="text-[11px] text-slate-400">Handling invoice.paid events in Next.js 15.</p>
        </div>
      </div>
    </div>

    <!-- Completed -->
    <div class="bg-[#121426] p-4 rounded-2xl border border-slate-800 flex flex-col space-y-3">
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Done (3)</span>
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      </div>
      <div class="space-y-2.5 flex-1">
        <div class="p-3 bg-[#181b33] rounded-xl border border-slate-800/80 space-y-2 opacity-80">
          <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">System</span>
          <h4 class="text-xs font-semibold text-white">Prompt Engine Integration</h4>
        </div>
      </div>
    </div>
  </main>

  <script>
    function addNewTask() {
      const title = prompt('Enter new task title:');
      if (title) {
        alert(\`Task "\${title}" added to Backlog!\`);
      }
    }
  </script>
</body>
</html>`;
}

/* ========================================================================= */
/* 5. CUSTOM MODERN APPLICATION PREVIEW                                      */
/* ========================================================================= */
function generateCustomAppHtml(prompt: string, integrations: string[]): string {
  const safePrompt = (prompt || "Custom Vibe App").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const integrationsList = integrations.length > 0 ? integrations.join(", ") : "Stripe, Slack, Shopify";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#090a10] text-slate-100 min-h-screen flex flex-col font-sans">
  <header class="bg-[#0e101c] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
        <i class="fa-solid fa-bolt"></i>
      </div>
      <div>
        <h1 class="font-bold text-sm text-white">Generated App Interface</h1>
        <p class="text-[11px] text-slate-400 font-mono">Dynamic AI Synthesis</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span class="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-mono">
        Active Integrations: ${integrationsList}
      </span>
    </div>
  </header>

  <main class="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
    <div class="p-6 rounded-2xl bg-[#121424] border border-slate-800 space-y-4">
      <div class="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
        <i class="fa-solid fa-sparkles"></i> App Spec & Directives
      </div>
      <h2 class="text-xl font-bold text-white capitalize">${safePrompt}</h2>
      <p class="text-xs text-slate-300 leading-relaxed">
        This interactive application preview was generated to fulfill your natural language prompt directives with connected API middleware and verified schemas.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div class="p-3.5 rounded-xl bg-[#090a10] border border-slate-800">
          <span class="text-[11px] text-slate-400 block">Connected Services</span>
          <span class="text-sm font-bold text-white mt-0.5 block">${integrations.length || 3} Active</span>
        </div>
        <div class="p-3.5 rounded-xl bg-[#090a10] border border-slate-800">
          <span class="text-[11px] text-slate-400 block">Response State</span>
          <span class="text-sm font-bold text-emerald-400 mt-0.5 block">200 OK Live</span>
        </div>
        <div class="p-3.5 rounded-xl bg-[#090a10] border border-slate-800">
          <span class="text-[11px] text-slate-400 block">Environment</span>
          <span class="text-sm font-bold text-violet-400 mt-0.5 block">Full-Stack Sandbox</span>
        </div>
      </div>
    </div>

    <!-- Interactive Action Trigger -->
    <div class="p-6 rounded-2xl bg-[#121424] border border-slate-800 space-y-3 text-center">
      <h3 class="text-sm font-bold text-white">Test Integration Handshake</h3>
      <p class="text-xs text-slate-400">Click below to test live event dispatchers and webhook listeners.</p>
      <button onclick="alert('⚡ Action Dispatched! Live mock webhook executed successfully.')" class="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg inline-flex items-center gap-2">
        <i class="fa-solid fa-play"></i> Execute Action
      </button>
    </div>
  </main>
</body>
</html>`;
}

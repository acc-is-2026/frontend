import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box, Group, Title, Text, ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./MediaSection.module.css";

export interface MediaSectionProps {
  title: string;
  subtitle?: string;
  href?: string;
  action?: React.ReactNode;
  scrollToIndex?: number;
  children: React.ReactNode;
}

export function MediaSection({
  title,
  subtitle,
  href,
  action,
  scrollToIndex,
  children,
}: MediaSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || scrollToIndex == null || scrollToIndex < 0) return;

    const target = el.children[scrollToIndex] as HTMLElement | undefined;
    if (!target) return;

    const containerRect = el.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetCenter =
      targetRect.left +
      targetRect.width / 2 -
      containerRect.left +
      el.scrollLeft;

    el.scrollTo({
      left: targetCenter - el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [scrollToIndex]);

  return (
    <Box component="section" mb={40}>
      <Group justify="space-between" align="flex-end" mb="md">
        <Box>
          {href ? (
            <Link to={href} className={classes.titleLink}>
              <Title
                order={3}
                c="inherit"
                size="xl"
                fw={700}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {title}
                <IconChevronRight size={22} style={{ marginTop: 2 }} />
              </Title>
            </Link>
          ) : (
            <Title
              order={3}
              c="white"
              fw={700}
              size="xl"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {title}
            </Title>
          )}

          {subtitle && (
            <Text size={"xs"} c="dimmed" mt={2}>
              {subtitle}
            </Text>
          )}
        </Box>

        <Group gap="sm">
          {action}
          <Group gap={6} visibleFrom="sm">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              radius="xl"
              disabled={!canScrollLeft}
              onClick={() => handleScroll("left")}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                opacity: canScrollLeft ? 1 : 0.3,
                cursor: canScrollLeft ? "pointer" : "default",
              }}
            >
              <IconChevronLeft size={18} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              radius="xl"
              disabled={!canScrollRight}
              onClick={() => handleScroll("right")}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                opacity: canScrollRight ? 1 : 0.3,
                cursor: canScrollRight ? "pointer" : "default",
              }}
            >
              <IconChevronRight size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Group>

      <Box
        ref={scrollRef}
        px="md"
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          paddingTop: 6,
          paddingBottom: 6,
          marginTop: -6,
          marginBottom: -6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

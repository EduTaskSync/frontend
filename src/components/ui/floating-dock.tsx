import { cn } from '@/lib/utils';
// Replace the existing import with this lazy-loaded version
import { Suspense, lazy, useRef, useState } from 'react';
import { AnimatePresence, MotionValue, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Link } from 'react-router';

// Lazy load the icon to reduce initial bundle size
const IconLayoutNavbarCollapse = lazy(() =>
  import('@tabler/icons-react').then((module) => ({ default: module.IconLayoutNavbarCollapse }))
);

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  iconBackgroundClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  iconBackgroundClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        iconBackgroundClassName={iconBackgroundClassName}
      />
      <FloatingDockMobile items={items} className={mobileClassName} iconBackgroundClassName={iconBackgroundClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  iconBackgroundClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  iconBackgroundClassName?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('relative block md:hidden', className)}>
      <AnimatePresence>
        {open && (
          <motion.div layoutId="nav" className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Link
                  to={item.href}
                  key={item.title}
                  className={cn(
                    'h-10 w-10 rounded-full bg-background border-border flex items-center justify-center',
                    iconBackgroundClassName
                  )}
                >
                  <div className="h-4 w-4 text-primary">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center"
      >
        <Suspense fallback={<div className="h-5 w-5 animate-pulse bg-primary/20 rounded-full" />}>
          <IconLayoutNavbarCollapse className="h-5 w-5 text-primary" />
        </Suspense>
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  iconBackgroundClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  iconBackgroundClassName?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'mx-auto hidden md:flex h-16 gap-4 items-end rounded-2xl bg-card text-card-foreground border border-border px-4 pb-3',
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} className={iconBackgroundClassName} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  className,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <Link to={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'aspect-square rounded-full bg-secondary text-secondary-foreground flex items-center justify-center relative',
          className
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-popover text-popover-foreground border border-border absolute left-1/2 -translate-x-1/2 -top-8 w-max text-center text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: widthIcon, height: heightIcon }} className="flex items-center justify-center">
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}

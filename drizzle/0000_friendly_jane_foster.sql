CREATE TABLE `beans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`index` integer NOT NULL,
	`is_botd` integer DEFAULT 0 NOT NULL,
	`cost` text NOT NULL,
	`image` text NOT NULL,
	`colour` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`country` text NOT NULL
);

CREATE TABLE `botd_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bean_id` integer NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`bean_id`) REFERENCES `beans`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX `botd_history_date_unique` ON `botd_history` (`date`);

CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bean_id` integer NOT NULL,
	`customer_name` text NOT NULL,
	`email` text NOT NULL,
	`quantity` integer NOT NULL,
	`total_cost` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`bean_id`) REFERENCES `beans`(`id`) ON UPDATE no action ON DELETE no action
);

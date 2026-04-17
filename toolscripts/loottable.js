// ===== BANNERS =====

const banners = {
    standard: {
        name: "Standard Archive",
        image: "../img/banners/moonveawe_gloves_reatup.webp",
        flavor: "A hand garment, blessed by the Goddes Herself.",
        color: "#888",
        items: [
            {
                name: "Steel Blade",
                rarity: "Common",
                stars: 2,
                chance: 50,
                desc: `<p>A sturdy steel sword.</p>`
            },
			{
                name: "Crude Axe",
                rarity: "Common",
                stars: 2,
                chance: 50,
                desc: `<p>A simple battleaxe.</p>`
            },
			{
                name: "10g",
                rarity: "Common",
                stars: 2,
                chance: 100,
                desc: `<p>A pouch containing 10 gold pieces.</p>`
            },
			{
                name: "A small gem",
                rarity: "Common",
                stars: 2,
                chance: 70,
                desc: `<p>A small gem worth 15 gold pieces.</p>`
            },
            {
                name: "Enchanted Dagger",
                rarity: "Uncommon",
                stars: 3,
                chance: 20,
                desc: `<p>This Dagger has +1 bonus to attack and damage.</p>`
            },
			{
                name: "Frost Bow",
                rarity: "Uncommon",
                stars: 3,
                chance: 20,
                desc: `<p>This bow deals additional d4 of cold damage.</p>`
            },
			{
                name: "50g",
                rarity: "Uncommon",
                stars: 3,
                chance: 30,
                desc: `<p>A small box containing 50 gold pieces.</p>`
            },
			{
                name: "An Amerhyst",
                rarity: "Uncommon",
                stars: 3,
                chance: 30,
                desc: `<p>A small amethyst worth 50 gold pieces.</p>`
            },
			{
                name: "The Lampmace",
                rarity: "Rare",
                stars: 4,
                chance: 5,
                desc: `<p>This mace has +1 bonus to attack and damage, as well as it deals additional 1d6 fire damage.</p>`
            },
			{
                name: "200g",
                rarity: "Rare",
                stars: 4,
                chance: 5,
                desc: `<p>A coffer contaioning 200g.</p>`
            },
			{
                name: "The Moonweave Gloves",
                rarity: "Legendary",
                stars: 5,
                chance: 2,
                desc: `<p>You gain true seeing up to 20 feet. Once per rest you may use Silver Arrow: You shoot a blazing silver arrow from the palm of your hand, that damagesand confuses enemies. You roll an Ranged Spell Attack agains an enemy within 60 feet of you. When hit they take 3d10 fire damage that cannot be reduced in any way and must make a DC 17 Constitution Saving or be Sluggish until the start of your next turn.</p>`
            }
			
        ]
    },

    mythic_banner: {
        name: "Crimson Revelation",
        image: "../img/banners/Blood_reverance.webp",
        flavor: "The air tightens. Something rare presses against reality.",
        color: "#ff3b3b",
        items: [
			{
                name: "Steel Crossbow",
                rarity: "Common",
                stars: 2,
                chance: 60,
                desc: `<p>A sleek steel crossbow.</p>`
            },
			{
                name: "Insence",
                rarity: "Common",
                stars: 2,
                chance: 60,
                desc: `<p>A good smelling mix of insence.</p>`
            },
			{
                name: "Writing Implements",
                rarity: "Common",
                stars: 2,
                chance: 60,
                desc: `<p>Paper, ink and quill.</p>`
            },
			{
                name: "10g",
                rarity: "Common",
                stars: 2,
                chance: 120,
                desc: `<p>A pouch containing 10 gold pieces.</p>`
            },
			{
                name: "Gem Dust",
                rarity: "Common",
                stars: 2,
                chance: 80,
                desc: `<p>A pile of gem dust worth 15g.</p>`
            },
            {
                name: "Masterwork Weapon Ticket",
                rarity: "Uncommon",
                stars: 3,
                chance: 10,
                desc: `<p>You can exchange it for a +1 weapon of choice.</p>`
            },
			{
                name: "Fire Lash",
                rarity: "Uncommon",
                stars: 3,
                chance: 30,
                desc: `<p>This whip deals 2d4 fire damage instead of it's normal damage.</p>`
            },
			{
                name: "50g",
                rarity: "Uncommon",
                stars: 3,
                chance: 40,
                desc: `<p>A small string with 50 gold pieces hanged on it.</p>`
            },
			{
                name: "Rough Ruby",
                rarity: "Uncommon",
                stars: 3,
                chance: 40,
                desc: `<p>A small rough rby worth 60 gold pieces.</p>`
            },
			{
                name: "The Mask of Many Faces",
                rarity: "Rare",
                stars: 4,
                chance: 10,
                desc: `<p>Once per day you may alter the appearance of your face. This feels magical, yet horrific.</p>`
            },
			{
                name: "Gold Bar",
                rarity: "Rare",
                stars: 4,
                chance: 10,
                desc: `<p>A gold bar worth 200 gold pieces.</p>`
            },
            {
                name: "The Thristing Blade",
                rarity: "Legendary",
                stars: 5,
                chance: 3,
                desc: `<p>WIP</p>`
            },
            {
                name: "The Crimson Reverence",
                rarity: "Mythic",
                stars: 6,
                chance: 1,
                desc: `<p>Wip</p>`
            }
        ]
    },

/*
    ethereal_banner: {
        name: "Fading Echoes",
        image: "../img/makrevikk_no_bg.png",
        flavor: "Not everything here fully exists. Not everything wants to.",
        color: "#aeefff",
        items: [
            {
                name: "Ethereal Fragment",
                rarity: "Ethereal",
                stars: 1,
                chance: 10,
                desc: `<p>It flickers between states.</p>`
            }
        ]
    }
*/
	
};
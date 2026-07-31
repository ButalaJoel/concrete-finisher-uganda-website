// ======================================================
// FILE: StatsCards.jsx
//
// PURPOSE:
// Dashboard Statistics.
//
// AUTHOR:
// Joel Butala
// ======================================================

import {

    ClipboardList,
    FolderOpen,
    Clock3,
    CircleDollarSign

} from "lucide-react";

const cards = [

    {

        title: "New Quotations",

        value: "15",

        icon: ClipboardList

    },

    {

        title: "Active Projects",

        value: "8",

        icon: FolderOpen

    },

    {

        title: "Pending",

        value: "4",

        icon: Clock3

    },

    {

        title: "Revenue",

        value: "UGX 12.5M",

        icon: CircleDollarSign

    }

];

function StatsCards() {

    return (

        <section className="stats-grid">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        className="stat-card"
                        key={card.title}
                    >

                        <Icon size={28} />

                        <h3>{card.value}</h3>

                        <p>{card.title}</p>

                    </div>

                );

            })}

        </section>

    );

}

export default StatsCards;
import {
    animate,
    query,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const fadeIn = trigger('fadeInAnimation', [
    transition('* <=> *', [
        query(
            ':leave',
            [
                style({
                    display: 'none',
                }),
            ],
            {
                optional: true,
            }
        ),
        query(
            ':enter, :leave',
            [
                style({
                    opacity: 0,
                }),
            ],
            {
                optional: true,
            }
        ),
        query(
            ':enter',
            [
                animate(
                    '1000ms ease',
                    style({
                        opacity: 1,
                    })
                ),
            ],
            {
                optional: true,
            }
        ),
    ]),
]);

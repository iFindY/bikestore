import { Component, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor() {
  }

  items: MegaMenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Products',
        items: [
          [
            {
              label: 'TV\'s',
              items: [{ label: 'Product 1.1' }, { label: 'Product 1.2' }]
            },
            {
              label: 'Videos',
              items: [{ label: 'Video 1.1' }, { label: 'Video 1.2' }]
            }
          ],
          [
            {
              label: 'Games',
              items: [{ label: 'Game 3.1' }, { label: 'Game 3.2' }]
            },
            {
              label: 'Food',
              items: [{ label: 'Food 4.1' }, { label: 'Food 4.2' }]
            }
          ]
        ]
      },
      {
        label: 'Services',
        items: [
          [
            {
              label: 'Service 1',
              items: [{ label: 'User 1.1' }, { label: 'User 1.2' }]
            },
            {
              label: 'Service 2',
              items: [{ label: 'User 2.1' }, { label: 'User 2.2' }]
            },
          ],
          [
            {
              label: 'Service 3',
              items: [{ label: 'User 3.1' }, { label: 'User 3.2' }]
            },
            {
              label: 'Service 4',
              items: [{ label: 'User 4.1' }, { label: 'User 4.2' }]
            }
          ],
          [
            {
              label: 'Service 5',
              items: [{ label: 'User 5.1' }, { label: 'User 5.2' }]
            },
            {
              label: 'Service 6',
              items: [{ label: 'User 6.1' }, { label: 'User 6.2' }]
            }
          ]
        ]
      },
      {
        label: 'Events',
        items: [
          [
            {
              label: 'Event 1',
              items: [{ label: 'Event 1.1' }, { label: 'Event 1.2' }]
            },
            {
              label: 'Event 2',
              items: [{ label: 'Event 2.1' }, { label: 'Event 2.2' }]
            }
          ],
          [
            {
              label: 'Event 3',
              items: [{ label: 'Event 3.1' }, { label: 'Event 3.2' }]
            },
            {
              label: 'Event 4',
              items: [{ label: 'Event 4.1' }, { label: 'Event 4.2' }]
            }
          ]
        ]
      },
      {
        label: 'Settings',
        items: [
          [
            {
              label: 'Setting 1',
              items: [{ label: 'Setting 1.1' }, { label: 'Setting 1.2' }]
            },
            {
              label: 'Setting 2',
              items: [{ label: 'Setting 2.1' }, { label: 'Setting 2.2' }]
            },
            {
              label: 'Setting 3',
              items: [{ label: 'Setting 3.1' }, { label: 'Setting 3.2' }]
            }
          ],
          [
            {
              label: 'Technology 4',
              items: [{ label: 'Setting 4.1' }, { label: 'Setting 4.2' }]
            }
          ]
        ]
      }
    ];
  }
}

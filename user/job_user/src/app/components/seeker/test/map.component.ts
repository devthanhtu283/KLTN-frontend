
// import { Component, OnInit } from '@angular/core';
// import * as L from 'leaflet';
// import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// @Component({
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.css']
// })
// export class MapComponent implements OnInit {
//   private map: any;

//   constructor() {}

//   ngOnInit(): void {
//     this.initMap();
//     this.getCurrentLocation();
//     this.addSearchControl();
//   }

//   private initMap(): void {
//     // Khởi tạo bản đồ với vị trí mặc định (ví dụ: Hà Nội)
//     this.map = L.map('map').setView([21.0285, 105.8542], 13);

//     // Thêm tile layer (bản đồ nền)
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(this.map);
//   }

//   private getCurrentLocation(): void {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const lat = position.coords.latitude;
//           const lng = position.coords.longitude;

//           // Di chuyển bản đồ đến vị trí hiện tại
//           this.map.setView([lat, lng], 13);

//           // Thêm marker tại vị trí hiện tại
//           L.marker([lat, lng]).addTo(this.map)
//             .bindPopup('Vị trí hiện tại của bạn')
//             .openPopup();
//         },
//         (error) => {
//           console.error('Lỗi khi lấy vị trí:', error);
//         }
//       );
//     } else {
//       console.error('Trình duyệt không hỗ trợ Geolocation.');
//     }
//   }

//   private addSearchControl(): void {
//     // Tạo provider để tìm kiếm địa điểm (sử dụng OpenStreetMap)
//     const provider = new OpenStreetMapProvider();

//     // Tạo control tìm kiếm (không sử dụng 'new')
//     const searchControl = GeoSearchControl({
//         provider: provider,
//         style: 'button',
//         showMarker: true,
//         showPopup: true,
//         marker: {
//             icon: new L.Icon.Default(),
//             draggable: false,
//         },
//         popupFormat: ({ query, result }) => result.label,
//         maxMarkers: 1,
//         retainZoomLevel: false,
//         animateZoom: true,
//         autoClose: true,
//         searchLabel: 'Nhập địa điểm...',
//         keepResult: true,
//         position: 'topright', // Đặt vị trí của thanh tìm kiếm
//     });

//     // Thêm control tìm kiếm vào bản đồ
//     this.map.addControl(searchControl);
// }
// }
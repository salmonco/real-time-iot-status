## 24-2 자기주도 프로젝트 : IoT 환경에서 준실시간 상태정보 표출하는 대시보드 개발

![자기주도프로젝트_봉지수](https://github.com/user-attachments/assets/3f4995c0-6552-41c8-a948-bda5bb6c1618)

<br>

### 준실시간 상태정보 표출

| Site List | 개별 Site의 특정 상태정보 | 하나의 Site 내의 특정 상태정보|
|---|---|---|
| <img alt="스크린샷 2024-10-23 오후 10 55 14" src="https://github.com/user-attachments/assets/84c5b637-af32-4afc-800b-7a8bc4b56281"> | <img alt="스크린샷 2024-10-23 오후 10 55 49" src="https://github.com/user-attachments/assets/afe91a4b-2642-4ab5-9b53-54c7285450ec"> | <img alt="스크린샷 2024-10-23 오후 10 57 14" src="https://github.com/user-attachments/assets/2d221d96-f77f-4c0f-863d-3c584b8643af"> |

<br>

### 개발 진행 과정

- 각각 Polling, WebSocket, MQTT 방식으로 구현한 뒤 이를 하나의 리포지토리에 통합하여 테스트 환경을 구성했습니다.
- [WebSocket 구현 리포지토리](https://github.com/salmonco/websocket-farm)
- [MQTT 구현 리포지토리](https://github.com/salmonco/mqtt-farm)

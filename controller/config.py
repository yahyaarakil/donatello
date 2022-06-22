COMS = {
    'WEB_PROTOCOL': 'ws',
    # 'SERVER_ADDRESS':'192.168.43.203',
    'SERVER_ADDRESS':'localhost',
    'SERVER_PORT': 5050,
    'PING_TIMER': 5,
    'MAX_REQ_QUEUE_SIZE': 500,
    'LOGIN_CREDENTIALS': {
        'id': 100,
        'password': 'donatello20223',
        'name': 'donatello_mk_2',
        'email': 'mustafa.aygun@metu.edu.tr'
    }
}
ARDU = {
    'ARDUPILOT_ADDRESS': 'tcp:localhost:5762',
    'HOME_COORDINATE': (35.24652248477128, 33.02829064983303, 50),
    'LOCATION_POST_INTERVAL': 15
}
GEN = {
    'TARGET_REFRESH_RATE': 20
}
MOV = {
    'STOPPING_DISTANCE': 1e-9
}
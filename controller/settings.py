settings = {
    'missions': {
        # what should donatello do when a scheduled mission comes up while it is not idle (it is already
        # performing another mission)
        # 0 - ignore new mission
        # 1 - queue up new mission and run it as soon as current mission is over
        # 2 - abort current mission and run new mission
        'schedule_override_behavior': 2
    }
}